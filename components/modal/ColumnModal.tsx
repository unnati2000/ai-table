import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";

import { useState, useEffect } from "react";

import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import Table from "../table/Table";

import { Column } from "@/types/table";

export const ColumnModal = <T extends { id: string }>({
  isOpen,
  onClose,
  columnNames,
  rows,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  columnNames: string[];
  rows: T[];
}) => {
  const [tableName, setTableName] = useState<string>("");
  const [isColumnDragEnabled, setIsColumnDragEnabled] =
    useState<boolean>(false);
  const [isRowDragEnabled, setIsRowDragEnabled] = useState<boolean>(false);
  const [columns, setColumns] = useState<Column<T>[]>();
  const [visibleColumns, setVisibleColumns] = useState<Column<T>[]>();

  useEffect(() => {
    const initialColumns: Column<T>[] = columnNames.map((header) => ({
      header: header.trim(),
      label: header.trim(),
      key: header.trim().toLowerCase().replace(/\s+/g, "_"),
      isSortable: true,
      isResizable: true,
      isRowHeader: true,
      // @ts-expect-error:  error
      cell: ({ row }) => <div>{row[header]}</div>,
    }));
    setColumns(initialColumns);
    setVisibleColumns(initialColumns);
    // }
  }, [columnNames]);

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h1>Table settings</h1>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            {/* table name */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-zinc-500">Table Name</p>
                <Input
                  placeholder="Table name"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 justify-between">
                <Checkbox
                  isSelected={isColumnDragEnabled}
                  onValueChange={setIsColumnDragEnabled}
                >
                  Is column drag enabled
                </Checkbox>

                <Checkbox
                  isSelected={isRowDragEnabled}
                  onValueChange={setIsRowDragEnabled}
                >
                  Is Row drag enabled
                </Checkbox>
              </div>
            </div>

            {rows.length > 0 && columns && visibleColumns ? (
              <Table
                columns={columns as Column<T>[]}
                isColumnDragEnabled={isColumnDragEnabled}
                isRowDragEnabled={isRowDragEnabled}
                tableTitle={tableName}
                isLoading={false}
                loadingState={() => <div></div>}
                tableData={rows}
                setTableData={() => {}}
                selectedData={[]}
                setSelectedData={() => {}}
                visibleColumns={visibleColumns as Column<T>[]}
                setVisibleColumns={setVisibleColumns}
                setIsLoading={() => {}}
                tableActions={null}
                hasRightClickMenu
                isRowSelectionEnabled={true}
                sortColumn={{
                  key: "",
                  order: "",
                }}
                setSortColumn={() => {}}
                rowActions={[]}
                scrollHeight={400}
              />
            ) : null}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="solid" color="primary" onClick={() => {}}>
            Let&apos;s go
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

