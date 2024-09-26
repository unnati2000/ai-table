import { useCallback } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMergedRef } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import { PiDotsSixVerticalLight } from "react-icons/pi";

// import { ChevronBottom, ChevronTop } from "@tessact/icons";

import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";

import { Column } from "@/types/table";

import { Checkbox } from "@nextui-org/react";
import ResizeHandle from "./ResizeHandles";

interface TableColumnProps<T> {
  column: Column<T>;
  index: number;
  isAllRowsSelected: boolean;
  setSelectedData: (data: T[]) => void;
  data: T[];
  sortColumn?: {
    key: string;
    order: "asc" | "desc" | "";
  };
  setSortColumn?: (data: { key: string; order: "asc" | "desc" | "" }) => void;
  visibleColumns: Column<T>[];
  hasTableHeader: boolean;
  isColumnDragEnabled: boolean;
  isSelectionEnabled: boolean;
  setVisibleColumns: (data: Column<T>[]) => void;
  columnWidths: Record<string, number>;
  setColumnWidths: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const TableColumn = <
  T extends {
    id: string;
  }
>({
  column,
  index,
  // hasTableHeader,
  isAllRowsSelected,
  setSelectedData,
  data,
  sortColumn,
  setSortColumn,
  // visibleColumns,
  isColumnDragEnabled,
  isSelectionEnabled = true,
  columnWidths,
  setColumnWidths,
}: TableColumnProps<T>) => {
  const handleResize = useCallback(
    (width: number) => {
      setColumnWidths((prev) => ({ ...prev, [column.key]: width }));
    },
    [column.key, setColumnWidths]
  );

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: column.key,
    });

  const mergedRef = useMergedRef(setNodeRef);

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative" as React.CSSProperties["position"],
    transform: CSS.Translate.toString(transform),
    transition:
      "width transform 0.2s ease-in-out" as React.CSSProperties["transition"],
    whiteSpace: "nowrap",
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <th
      style={{
        ...style,
        width: columnWidths[column.key] || column.minWidth || "auto",
        minWidth: column.minWidth || 50,
        maxWidth: column.maxWidth || "none",
        position: "relative",
        // width: visibleColumns[index]?.width ?? 'auto'
      }}
      key={column.key}
      ref={mergedRef}
      className={cn(
        "group relative text-sm border-r font-medium border-b border-zinc-700",
        "overflow-hidden"
      )}
    >
      <motion.div
        initial={{
          opacity: 0,
          x: 10,
        }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.2,
            ease: "easeInOut",
          },
        }}
        exit={{
          opacity: 0,
          x: 10,
          transition: {
            duration: 0.2,
            ease: "easeInOut",
          },
        }}
        className="flex justify-between overflow-hidden px-4"
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <div className="truncate">
          <div className="flex items-center gap-3 py-3">
            {isColumnDragEnabled ? (
              <PiDotsSixVerticalLight
                className="cursor-pointer"
                {...attributes}
                {...listeners}
              />
            ) : (
              <div className="h-4 w-4" />
            )}
            {isSelectionEnabled && index === 0 && (
              <Checkbox
                isSelected={isAllRowsSelected}
                size={"sm"}
                onValueChange={() => {
                  if (isAllRowsSelected) {
                    setSelectedData([]);
                  } else {
                    setSelectedData(data);
                  }
                }}
              />
            )}

            {column.header}

            {column.isSortable ? (
              <div
                className="flex flex-col"
                onClick={() => {
                  if (sortColumn?.key === column.key) {
                    setSortColumn?.({
                      key: column.key,
                      order: sortColumn.order === "asc" ? "desc" : "asc",
                    });
                  } else {
                    setSortColumn?.({ key: column.key, order: "asc" });
                  }
                }}
              >
                <IoChevronUpSharp
                  size={10}
                  className={cn(
                    "cursor-pointer text-zinc-500",
                    sortColumn?.key === column.key &&
                      sortColumn.order === "asc" &&
                      "text-zinc-200"
                  )}
                />
                <IoChevronDownSharp
                  size={10}
                  className={cn(
                    "cursor-pointer text-zinc-500",
                    sortColumn?.key === column.key &&
                      sortColumn.order === "desc" &&
                      "text-zinc-200"
                  )}
                />
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
      {column.isResizable && (
        <ResizeHandle
          onResize={handleResize}
          minWidth={column.minWidth || 50}
          maxWidth={column.maxWidth || 500}
        />
      )}
    </th>
  );
};

export default TableColumn;

