import { useEffect, useRef } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@nextui-org/react";
import * as ContextMenu from "@radix-ui/react-context-menu";

// import { DotGrid1X3HorizontalThin } from "@tessact/icons";
import { BsThreeDots } from "react-icons/bs";

import { Column } from "@/types/table";

import { Button } from "@nextui-org/react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import TableCell from "./TableCell";

const TableRow = <T extends { id: string }>({
  row,
  columns,
  isAllRowsSelected,
  selectedData,
  isLastRow,
  setSelectedData,
  isRowDragEnabled,
  hasRowActions,
  rowActions,
  index,
  focusIndex,
  isSelectionEnabled,
  onRowClick,
  hasRightClickMenu,
  rightClickMenuOptions,
}: // setFocusIndex
{
  row: T;
  columns: Column<T>[];
  isAllRowsSelected: boolean;
  selectedData: T[];
  setSelectedData: (value: T[]) => void;
  isLastRow: boolean;
  isRowDragEnabled: boolean;
  hasRowActions: boolean;
  rowActions?: {
    label: string;
    onAction: (id: string) => void;
  }[];
  index: number;
  focusIndex: number;
  isSelectionEnabled: boolean;
  setFocusIndex: (value: number) => void;
  onRowClick?: (row: T) => void;
  hasRightClickMenu: boolean;
  rightClickMenuOptions?: {
    label: React.ReactNode;
    key: string;
    onAction: (id: string) => void;
  }[];
}) => {
  const rowRef = useRef<HTMLTableRowElement | null>(null);

  const handleRowSelectionChange = (row: T) => {
    if (selectedData.filter((item: T) => item?.id === row?.id)?.length) {
      setSelectedData(selectedData.filter((item: T) => item?.id !== row?.id));
    } else {
      setSelectedData([...selectedData, row]);
    }
  };

  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: row.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative" as React.CSSProperties["position"],
  };

  useEffect(() => {
    if (focusIndex === index && rowRef.current) {
      rowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focusIndex, index]);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        className="contents w-full"
        disabled={!hasRightClickMenu}
      >
        <tr
          ref={(el) => {
            if (el) {
              rowRef.current = el;
              setNodeRef(el);
            }
          }}
          style={style}
          className={cn("w-full border-zinc-800  transition", {
            "border-b": !isLastRow,
            "bg-ds-table-row-bg-selected": focusIndex === index,
            "cursor-pointer hover:bg-ds-table-row-bg-hover":
              isSelectionEnabled || onRowClick,
          })}
          // onMouseEnter={() => {
          //   if (isSelectionEnabled) {
          //     setFocusIndex(index);
          //   }
          // }}
          onClick={(e) => {
            e.stopPropagation();
            if (isSelectionEnabled && onRowClick) {
              onRowClick(row);
            }

            if (isSelectionEnabled && !onRowClick) {
              handleRowSelectionChange(row);
            }

            if (!isSelectionEnabled && onRowClick) {
              onRowClick(row);
            }
          }}
        >
          {columns.map((column, index) => (
            <TableCell
              key={column.key}
              column={column}
              row={row}
              isSelectionEnabled={isSelectionEnabled}
              index={index}
              handleRowSelectionChange={handleRowSelectionChange}
              isRowSelected={
                isAllRowsSelected ||
                selectedData.filter((item: T) => item.id === row.id)?.length
                  ? true
                  : false
              }
              isRowDragEnabled={isRowDragEnabled}
            />
          ))}
          {hasRowActions && (
            <td className="w-10">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => {}}
                  >
                    <BsThreeDots size={14} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu items={rowActions}>
                  {rowActions?.map((action) => (
                    <DropdownItem
                      key={action.label}
                      onPress={() => action.onAction(row.id)}
                    >
                      {action.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </td>
          )}
        </tr>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="z-50 min-w-[200px] data-[state=open]:animate-custom-in">
          <Listbox
            classNames={{ base: "border border-ds-menu-border", list: "p-1" }}
          >
            {rightClickMenuOptions?.map((option) => (
              <ListboxItem
                key={option.key}
                onPress={() => option.onAction(row.id)}
                as={ContextMenu.Item}
              >
                {option.label}
              </ListboxItem>
            ))}
          </Listbox>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export default TableRow;

