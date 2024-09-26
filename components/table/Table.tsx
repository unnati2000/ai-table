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

interface TableProps<T> {
  columns: Column<T>[];
  selectedData: T[];
  tableData: T[];
  setTableData: (data: T[]) => void;
  visibleColumns: Column<T>[];
  setVisibleColumns: (data: Column<T>[]) => void;
  // paginationScrollRef?: React.LegacyRef<HTMLDivElement> | null;
  setSelectedData: (data: T[]) => void;
  sortColumn?: {
    key: string;
    order: "asc" | "desc" | "";
  };
  tableActions: React.ReactNode;
  setSortColumn?: (data: { key: string; order: "asc" | "desc" | "" }) => void;
  isLoading: boolean;
  loadingState: React.ReactNode;
  isRowDragEnabled: boolean;
  isColumnDragEnabled: boolean;
  hasRowActions?: boolean;
  rowActions?: {
    label: string;
    onAction: (id: string) => void;
  }[];
  isRowSelectionEnabled?: boolean;
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

const Table = <
  T extends {
    id: string;
  }
>({
  columns,
  tableData,
  visibleColumns,
  setVisibleColumns,
  setTableData,
  selectedData,
  setSelectedData,
  tableActions,
  isLoading,
  loadingState,
  isRowDragEnabled,
  isColumnDragEnabled,
  hasRowActions = false,
  rowActions,
  isRowSelectionEnabled = true,
  scrollHeight,
  topContent,
  tableActionsY = 16,
  onRowClick,
  hasRightClickMenu = false,
  rightClickMenuOptions,
  setSortColumn,
  sortColumn,
}: TableProps<T>) => {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const isAllRowsSelected = useMemo(
    () => selectedData?.length === tableData?.length && tableData?.length > 0,
    [selectedData, tableData]
  );

  const [focusIndex, setFocusIndex] = useState(-1);

  // resizing column states

  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setVisibleColumns((items) => {
        const oldIndex = items?.findIndex((item) => item.key === active.id);
        const newIndex = items?.findIndex((item) => item.key === over.id);
        const newColumns = arrayMove(items, oldIndex, newIndex);

        return newColumns;
      });
    }
  };

  const handleRowDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    setTableData((items: T[]) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newRows = arrayMove(items, oldIndex, newIndex);

      return newRows;
    });
  };

  const handleHide = (columnKey: Key) => {
    if (visibleColumns?.find((item) => item.key === columnKey)) {
      if (visibleColumns?.length === 1) return;
      const newColumns = visibleColumns?.filter(
        (item) => item.key !== columnKey
      );
      setVisibleColumns(newColumns);
    } else {
      const column = columns?.find((item) => item.key === columnKey);
      if (column) {
        const newColumns = [...visibleColumns, column];
        setVisibleColumns(newColumns);
      }
    }
  };

  const tableHeadRef = useRef<HTMLTableRowElement>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  useEffect(() => {
    const initialWidths = visibleColumns?.reduce((acc, column) => {
      acc[column?.key] = column?.minWidth || 100; // Use 100 as default minWidth if not specified
      return acc;
    }, {} as Record<string, number>);
    setColumnWidths(initialWidths);
  }, [visibleColumns]);

  useEffect(() => {
    if (sortColumn?.key && sortColumn.order) {
      const sortedData = [...tableData].sort((a, b) => {
        const aValue = a[sortColumn?.key as keyof T];
        const bValue = b[sortColumn?.key as keyof T];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortColumn.order === "asc"
            ? aValue?.localeCompare(bValue)
            : bValue?.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortColumn?.order === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        // For other types, you might want to add more specific sorting logic
        return 0;
      });

      setTableData(sortedData);
    } else {
      // If no sort is applied, reset to original data order
      setTableData(tableData);
    }
  }, [sortColumn, tableData]);

  return (
    <div className={"relative h-full"}>
      <div className={cn("relative rounded-xl")}>
        <Dropdown closeOnSelect={false}>
          <DropdownTrigger>
            <Button
              size="lg"
              className={`absolute right-0 top-0 z-50 h-12 w-11 flex items-center justify-center rounded-none`}
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
            <div
              ref={tableContainerRef}
              className="relative border overflow-x-auto"
            >
              <table
                className="w-full"
                suppressHydrationWarning
                style={{
                  // tableLayout: "fixed",
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
                          isSelectionEnabled={isRowSelectionEnabled}
                          setVisibleColumns={setVisibleColumns}
                          setSelectedData={setSelectedData}
                          visibleColumns={visibleColumns}
                          key={column.key}
                          isColumnDragEnabled={isColumnDragEnabled}
                          index={index}
                          isAllRowsSelected={isAllRowsSelected}
                          sortColumn={sortColumn}
                          setSortColumn={setSortColumn}
                          data={tableData}
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
                    items={tableData.map((item) => item.id)}
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
                              isSelectionEnabled={isRowSelectionEnabled}
                              focusIndex={focusIndex}
                              setFocusIndex={setFocusIndex}
                              hasRowActions={hasRowActions}
                              isRowDragEnabled={isRowDragEnabled}
                              row={item}
                              isLastRow={index === tableData?.length - 1}
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
          </ScrollShadow>
        </DndContext>
      </div>

      {!isLoading && tableData?.length === 0 ? (
        <div className="flex h-full items-center justify-center"></div>
      ) : null}

      {tableActions && selectedData?.length > 0 ? (
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

