import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import { RxHamburgerMenu } from "react-icons/rx";

import { Column } from "@/types/table";

import { Checkbox } from "@nextui-org/react";

const TableCell = <T extends { id: string }>({
  column,
  row,
  isRowSelected,
  handleRowSelectionChange,
  isRowDragEnabled,
  index,
  isSelectionEnabled,
}: {
  column: Column<T>;
  row: T;
  isRowSelected: boolean;
  handleRowSelectionChange: (value: T) => void;
  isRowDragEnabled: boolean;
  index: number;
  isSelectionEnabled: boolean;
}) => {
  const { isDragging, transform, setNodeRef, attributes, listeners } =
    useSortable({
      id: row.id,
    });

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative" as React.CSSProperties["position"],
    transform: CSS.Translate.toString(transform),
    transition:
      "width transform 0.2s ease-in-out" as React.CSSProperties["transition"],
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <motion.td
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
      ref={setNodeRef}
      style={style}
      className={cn("h-[72px] overflow-hidden px-4 py-3", {
        "px-10": index !== 0,
      })}
    >
      <div className="flex text-center h-full items-center  gap-3 overflow-hidden">
        {index == 0 ? (
          <div className="flex flex-shrink-0 items-center gap-2 pl-1">
            {isRowDragEnabled ? (
              <RxHamburgerMenu
                size={14}
                className="cursor-grab"
                {...attributes}
                {...listeners}
              />
            ) : (
              <div className="h-4 w-4" />
            )}

            {isSelectionEnabled && (
              <Checkbox
                isSelected={isRowSelected}
                size="sm"
                onValueChange={() => {
                  handleRowSelectionChange(row);
                }}
              />
            )}
          </div>
        ) : null}
        <div className="truncate">{column.cell({ row })}</div>
      </div>
    </motion.td>
  );
};

export default TableCell;

