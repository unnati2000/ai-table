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
  tableHeaderActions,
  headerContent,
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
}: TableProps<T>) => {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [query, setQuery] = useState<string>("");

  // const handleQuery = async (query: string) => {
  //   const formData = new FormData();
  //   formData.set("text", query);
  //   formData.set("columns", JSON.stringify(visibleColumns));
  //   formData.set("data", JSON.stringify(data));

  // };

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

  const prompt = `You are a React expert. You will be given a React column state for a table component on which you will need to make changes as per the user’s requirement. User will be providing the changes you need to make in natural language which you need to interpret and return a new state with the requirements made. 
                  
  The shape of the column state will be in this format:

export interface Column<T> {
  header: ReactNode;
  label: string;
  key: string;
  minWidth?: number;
  maxWidth?: number;
  canHide?: boolean;
  isSortable?: boolean;
  isResizable?: boolean;
  isRowHeader?: boolean;
  width?: number | null;
  cell: ({ row }: { row: T }) => ReactNode;
}

Here is the user’s data:

${JSON.stringify(data)}

And here is the user’s requirement:

${query}

The visible columns are ${JSON.stringify(visibleColumns)}

Always make sure you follow these rules:

1.⁠ ⁠Always respond in JSON in this format: { success: true / false, data: the modified state }

2.⁠ ⁠If you were able to understand the user’s requirements and make the required changes, respond with success as true and the send back the entire modified state in data. Do not send the partial state or only the  modified parts.

3.⁠ ⁠If you were not able to identify user’s requirement, send success as false and send back the same data that user sent you in the data field.

You need to update columns state and return the new state. Don't start with "Here is the new state" or anything like that. Return your response in the form of: 
{
  "success": true / false,
  "data": the modified state,
  "message": "Message to show to the user"
}
`;

  async function generateResponse() {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: "llama3.1",
        stream: false,
      }),
    });

    console.log({ res });
    const parsedResult = await res.json();
    console.log({ parsedResult });
    // return parsedResult;
  }

  return (
    <div className={"relative h-full"}>
      <div className={cn("relative rounded-xl border border-zinc-800")}>
        {hasTableHeader ? (
          <div
            className="flex items-center justify-between p-4"
            ref={headerRef}
          >
            <Input
              placeholder="Enter your query (e.g., 'Show me videos uploaded in August')"
              value={query}
              classNames={{
                input:
                  "bg-transparent p-2 min-w-96 border border-zinc-700 rounded-md outline-none",
              }}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  generateResponse();
                }
              }}
              className="flex-grow"
            />
            {headerContent}
            <div className="flex w-fit items-center gap-2">
              {tableHeaderActions?.map((action) => action.component)}
            </div>
          </div>
        ) : null}
        <Dropdown closeOnSelect={false}>
          <DropdownTrigger>
            <Button
              size="lg"
              className={`absolute right-0 top-0 z-50 h-11 w-11 flex items-center justify-center rounded-none rounded-tr-md bg-zinc-800 ${
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
            className={cn("w-full overflow-x-auto rounded-xl")}
            style={{
              maxHeight: scrollHeight
                ? `${scrollHeight}px`
                : "calc(100vh - 260px)",
            }}
          >
            <div ref={tableContainerRef} className="relative overflow-x-auto">
              <table
                className="w-full"
                style={{
                  tableLayout: "fixed",
                  marginBottom: tableActionsY ? `${tableActionsY}px` : "0px",
                }}
              >
                <thead className="sticky top-0 z-10  bg-default-100">
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
                  onDragEnd={() => {}}
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
                        : null}
                      {data.length > 0
                        ? data.map((item, index) => (
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
    </div>
  );
};

export default Table;

