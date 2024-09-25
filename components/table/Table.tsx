import { Key, ReactNode, useEffect, useMemo, useRef, useState } from "react";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Input } from "@nextui-org/react";

// import { ollama } from "ollama-ai-provider";

// import { enhanceText } from "@/actions/ai";
import {
  restrictToHorizontalAxis,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn, ScrollShadow } from "@nextui-org/react";
import { motion } from "framer-motion";

import { CiViewColumn } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";

// import { functionPrompt } from "@/actions/ai";

// import { CircleXFilled, ColumnWideAdd, MagnifyingGlass } from "@tessact/icons";

import { Column } from "@/types/table";

import { Button } from "@nextui-org/react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Switch } from "@nextui-org/react";
import TableColumn from "./TableColumn";
import TableRow from "./TableRow";
// import { ViewModal } from "../ViewModal";

interface TableHeaderAction {
  label: string;
  component: React.ReactNode;
  onAction: () => void;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  selectedData: T[];
  paginationScrollRef?: React.LegacyRef<HTMLDivElement> | null;
  setSelectedData: (data: T[]) => void;
  hasTableHeader: boolean;
  sortColumn?: {
    key: string;
    order: "asc" | "desc" | "";
  };
  emptyStateLabel?: string;
  emptyStateBody?: string;
  tableId: string;
  headerContent?: React.ReactNode;
  tableHeaderActions?: TableHeaderAction[];
  tableActions: React.ReactNode;
  setSortColumn?: (data: { key: string; order: "asc" | "desc" | "" }) => void;
  isLoading: boolean;
  loadingState: React.ReactNode;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  isRowDragEnabled: boolean;
  isColumnDragEnabled: boolean;
  hasRowActions?: boolean;
  rowActions?: {
    label: string;
    onAction: (id: string) => void;
  }[];
  isSelectionEnabled?: boolean;
  scrollHeight?: number;
  topContent?: {
    key: string;
    content: ReactNode;
  }[];
  tableActionsY?: number;
  onRowClick?: (row: T) => void;
  hasRightClickMenu?: boolean;
  rightClickMenuOptions?: {
    label: React.ReactNode;
    key: string;
    onAction: (id: string) => void;
  }[];
  setIsLoading: (isLoading: boolean) => void;
}

interface Sort {
  key: string;
  order: "asc" | "desc" | "";
}

const Table = <
  T extends {
    id: string;
  }
>({
  columns,
  data,
  paginationScrollRef,
  selectedData,
  setSelectedData,
  sortColumn,
  setSortColumn,
  hasTableHeader = false,
  // tableHeaderActions,
  // headerContent,
  tableActions,
  isLoading,
  loadingState,
  searchQuery,
  isRowDragEnabled,
  isColumnDragEnabled,
  onSearchQueryChange,
  hasRowActions = false,
  rowActions,
  isSelectionEnabled = true,
  scrollHeight,
  topContent,
  tableActionsY = 16,
  onRowClick,
  hasRightClickMenu = false,
  rightClickMenuOptions,
  tableId,
  emptyStateBody,
  emptyStateLabel,
  setIsLoading,
}: TableProps<T>) => {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [query, setQuery] = useState<string>("");
  const [tableData, setTableData] = useState<T[]>(data);
  const [sort, setSort] = useState<Sort>({
    key: "",
    order: "",
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const isAllRowsSelected = useMemo(
    () => selectedData.length === data.length && data?.length > 0,
    [selectedData, data]
  );

  const [visibleColumns, setVisibleColumns] = useState<Column<T>[]>(() => {
    if (typeof window !== "undefined" && tableId) {
      const storedColumns = JSON.parse(
        localStorage.getItem(`table-${tableId}`) || "[]"
      ) as string[];

      if (storedColumns.length === 0) {
        return columns;
      } else {
        const filteredColumns = columns.filter((col) =>
          storedColumns.includes(col.key)
        );

        const orderedColumns = storedColumns
          .map((key) => filteredColumns.find((col) => col.key === key))
          .filter((col): col is Column<T> => col !== undefined);

        return orderedColumns;
      }
    }
    return columns;
  });

  useEffect(() => {
    setVisibleColumns(() => {
      if (typeof window !== "undefined" && tableId) {
        const storedColumns = JSON.parse(
          localStorage.getItem(`table-${tableId}`) || "[]"
        ) as string[];

        if (storedColumns.length === 0) {
          return columns;
        } else {
          const filteredColumns = columns.filter((col) =>
            storedColumns.includes(col.key)
          );

          const orderedColumns = storedColumns
            .map((key) => filteredColumns.find((col) => col.key === key))
            .filter((col): col is Column<T> => col !== undefined);

          return orderedColumns;
        }
      }
      return columns;
    });
  }, [columns, tableId]);

  const [focusIndex, setFocusIndex] = useState(-1);

  // resizing column states

  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setVisibleColumns((items) => {
        const oldIndex = items.findIndex((item) => item.key === active.id);
        const newIndex = items.findIndex((item) => item.key === over.id);
        const newColumns = arrayMove(items, oldIndex, newIndex);

        localStorage.setItem(
          `table-${tableId}`,
          JSON.stringify(newColumns.map((col) => col.key))
        );

        return newColumns;
      });
    }
  };

  const handleRowDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    setTableData((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newRows = arrayMove(items, oldIndex, newIndex);

      return newRows;
    });
  };

  const handleHide = (columnKey: Key) => {
    if (visibleColumns.find((item) => item.key === columnKey)) {
      if (visibleColumns.length === 1) return;
      const newColumns = visibleColumns.filter(
        (item) => item.key !== columnKey
      );
      setVisibleColumns(newColumns);

      localStorage.setItem(
        `table-${tableId}`,
        JSON.stringify(newColumns.map((col) => col.key))
      );
    } else {
      const column = columns.find((item) => item.key === columnKey);
      if (column) {
        const newColumns = [...visibleColumns, column];
        setVisibleColumns(newColumns);
        localStorage.setItem(
          `table-${tableId}`,
          JSON.stringify(newColumns.map((col) => col.key))
        );
      }
    }
  };

  const tableHeadRef = useRef<HTMLTableRowElement>(null);

  const headerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const deserializeColumns = (columns: string) => {
    const parsedColumns: Column<T>[] = JSON.parse(columns);

    return parsedColumns.map((column) => ({
      ...column,
      cell: eval(`(${column.cell.toString()})`),
    }));
  };

  useEffect(() => {
    const initialWidths = visibleColumns.reduce((acc, column) => {
      acc[column.key] = column.minWidth || 100; // Use 100 as default minWidth if not specified
      return acc;
    }, {} as Record<string, number>);
    setColumnWidths(initialWidths);

    const storedColumns = localStorage.getItem(`table-${tableId}`);
    if (storedColumns?.length === 0) {
      const parsedColumns = JSON.parse(storedColumns);
      setVisibleColumns(parsedColumns);
    }
  }, [visibleColumns, tableId]);

  async function generateResponse() {
    try {
      setIsLoading(true);

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          query,
          visibleColumns,
        }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const responseData = await response.json();

      const deserializedColumns = deserializeColumns<T>(
        JSON.stringify(responseData.result.columns)
      );

      setVisibleColumns(deserializedColumns);
      setSelectedData(responseData.result.selectedData);

      setQuery("");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (sort.key && sort.order) {
      const sortedData = [...data].sort((a, b) => {
        const aValue = a[sort.key as keyof T];
        const bValue = b[sort.key as keyof T];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sort.order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sort.order === "asc" ? aValue - bValue : bValue - aValue;
        }

        // For other types, you might want to add more specific sorting logic
        return 0;
      });

      setTableData(sortedData);
    } else {
      // If no sort is applied, reset to original data order
      setTableData(data);
    }
  }, [sort, data]);

  return (
    <div className={"relative  h-full"}>
      <div className={cn("relative rounded-xl")}>
        {hasTableHeader ? (
          <div
            className="flex items-center gap-2 justify-between p-4"
            ref={headerRef}
          ></div>
        ) : null}
        <Dropdown closeOnSelect={false}>
          <DropdownTrigger>
            <Button
              size="lg"
              className={`absolute right-0 top-0 z-50 h-12 w-11 flex items-center justify-center rounded-none ${
                hasTableHeader
                  ? `top-[${headerRef.current?.clientHeight}px]`
                  : ""
              }`}
              isIconOnly
              variant="solid"
            >
              <CiViewColumn className="text-ds-text-secondary" size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            className="p-2 bg-zinc-900 rounded-md"
            onAction={(key) => handleHide(key)}
          >
            {columns.map((column) => (
              <DropdownItem
                key={column.key}
                className="p-2 hover:bg-zinc-950 rounded-md transition-colors duration-100 ease-in-out"
                endContent={
                  <Switch
                    size="sm"
                    isSelected={
                      visibleColumns?.filter((item) => item.key === column.key)
                        .length > 0
                        ? true
                        : false
                    }
                    onValueChange={() => {
                      handleHide(column.key);
                    }}
                  />
                }
              >
                {column.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={handleColumnDragEnd}
          sensors={sensors}
        >
          {/* Remove this random value of 200px from scrollbar */}
          <ScrollShadow
            visibility="none"
            className={cn(
              "w-full overflow-x-auto border border-zinc-700 rounded-xl"
            )}
            style={{
              maxHeight: scrollHeight
                ? `${scrollHeight}px`
                : "calc(100vh - 260px)",
            }}
          >
            <div ref={tableContainerRef} className="relative overflow-x-auto">
              <table
                className="w-full"
                suppressHydrationWarning
                style={{
                  tableLayout: "fixed",
                  marginBottom: tableActionsY ? `${tableActionsY}px` : "0px",
                }}
              >
                <thead className="sticky top-0 z-10">
                  <SortableContext
                    items={visibleColumns?.map((item) => item.key)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <tr className="w-full py-2" ref={tableHeadRef}>
                      {visibleColumns.map((column, index) => (
                        <TableColumn
                          column={column}
                          isSelectionEnabled={isSelectionEnabled}
                          hasTableHeader={hasTableHeader}
                          setVisibleColumns={setVisibleColumns}
                          setSelectedData={setSelectedData}
                          visibleColumns={visibleColumns}
                          key={column.key}
                          isColumnDragEnabled={isColumnDragEnabled}
                          index={index}
                          isAllRowsSelected={isAllRowsSelected}
                          sortColumn={sortColumn}
                          setSortColumn={setSortColumn}
                          data={data}
                          columnWidths={columnWidths}
                          setColumnWidths={setColumnWidths}
                        />
                      ))}
                      {hasRowActions && <td className="w-10" />}
                    </tr>
                  </SortableContext>
                </thead>

                {topContent && topContent.length ? (
                  <>
                    {topContent.map((item) => (
                      <tr key={item.key}>
                        <td colSpan={visibleColumns.length}>{item.content}</td>
                      </tr>
                    ))}
                  </>
                ) : null}

                <DndContext
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={handleRowDragEnd}
                  sensors={sensors}
                >
                  <SortableContext
                    items={data.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <tbody>
                      {isLoading
                        ? [...Array(5)].map((_, index) => (
                            <tr key={index}>
                              <td colSpan={visibleColumns.length}>
                                {loadingState}
                              </td>
                            </tr>
                          ))
                        : tableData.length > 0
                        ? tableData.map((item, index) => (
                            <TableRow
                              key={item.id}
                              hasRightClickMenu={hasRightClickMenu}
                              index={index}
                              isSelectionEnabled={isSelectionEnabled}
                              focusIndex={focusIndex}
                              setFocusIndex={setFocusIndex}
                              hasRowActions={hasRowActions}
                              isRowDragEnabled={isRowDragEnabled}
                              row={item}
                              isLastRow={index === data.length - 1}
                              columns={visibleColumns}
                              selectedData={selectedData}
                              setSelectedData={setSelectedData}
                              isAllRowsSelected={isAllRowsSelected}
                              rowActions={rowActions}
                              onRowClick={onRowClick}
                              rightClickMenuOptions={rightClickMenuOptions}
                            />
                          ))
                        : null}
                    </tbody>
                  </SortableContext>
                </DndContext>
              </table>
            </div>

            <div ref={paginationScrollRef} />
          </ScrollShadow>
        </DndContext>
      </div>

      {!isLoading && data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            {searchQuery.length ? (
              <>
                <div className="-z-1 relative">
                  <IoIosSearch className="h-10 w-10 text-ds-text-secondary" />
                  <div className="absolute left-0 top-1/2 z-100 -translate-y-1/2">
                    <IoMdCloseCircle
                      size={14}
                      className="text-ds-text-secondary"
                    />
                  </div>
                </div>

                <p>No assets matching your search</p>

                <Button
                  onPress={() => onSearchQueryChange("")}
                  color="secondary"
                >
                  Clear search
                </Button>
              </>
            ) : emptyStateLabel ? (
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-lg font-medium text-ds-text-primary">
                  {" "}
                  {emptyStateLabel}{" "}
                </p>
                <p className="text-sm text-ds-text-secondary">
                  {" "}
                  {emptyStateBody}{" "}
                </p>
              </div>
            ) : (
              <div>No data is present</div>
            )}
          </div>
        </div>
      ) : null}

      {tableActions && selectedData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: tableActionsY ? -tableActionsY : 16 }}
          animate={{ opacity: 1, y: tableActionsY ? tableActionsY : -16 }}
          exit={{ opacity: 0, y: tableActionsY ? -tableActionsY : 16 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "rounded-2xl bg-primary-400 px-4 py-2",
            "flex items-center justify-between gap-5",
            "bg-ds-button-default-bg text-ds-button-default-text",
            "absolute bottom-10 z-50",
            "w-full transition-colors "
          )}
        >
          {tableActions}
        </motion.div>
      ) : null}

      {/* <ViewModal
        isOpen={viewModalIsOpen}
        onClose={() => setViewModalIsOpen(false)}
      /> */}
    </div>
  );
};

export default Table;

