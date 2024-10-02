"use client";

import { BsFiletypeCsv } from "react-icons/bs";
import { useState, useRef } from "react";

import { ColumnModal } from "@/components/modal/ColumnModal";

import { Spinner } from "@nextui-org/react";

import Table from "@/components/table/Table";

import { Column } from "@/types/table";

import { useMemo } from "react";

import { deserializeColumns } from "@/utils/tableUtils";

const Playground = <
  T extends {
    id: string;
  }
>() => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split("\n");
        if (lines.length > 0) {
          const headers = lines[0].split(",").map((header) => header.trim());
          setColumnNames(headers);

          const dataRows = lines.slice(1).map((line) => {
            const values = line.split(",").map((cell) => cell.trim());
            const row: Record<string, string | number> = {};
            headers.forEach((header, index) => {
              const value = values[index];
              row[header] = isNaN(Number(value)) ? value : Number(value);
            });
            return row;
          });

          // @ts-expect-error:  error
          setRows(dataRows);
        }
        setIsOpen(true);
        setIsLoading(false);
      };
      reader.readAsText(file);
    }
  };

  // const columns = useMemo(
  //   () => deserializeColumns(localStorage.getItem("columns") || "[]"),
  //   []
  // );
  // const visibleColumns = useMemo(
  //   () => deserializeColumns(localStorage.getItem("columns") || "[]"),
  //   []
  // );

  // const tableRows = JSON.parse(localStorage.getItem("rows") || "[]");

  const isRowDragEnabled = JSON.parse(
    localStorage.getItem("isRowDragEnabled") || "false"
  );
  const isColumnDragEnabled = JSON.parse(
    localStorage.getItem("isColumnDragEnabled") || "false"
  );
  const tableName = localStorage.getItem("tableName") || "";

  const columns = useMemo<Column<T>[]>(
    () => deserializeColumns<T>(localStorage.getItem("columns") || "[]"),
    []
  );

  const visibleColumns = useMemo<Column<T>[]>(
    () => deserializeColumns<T>(localStorage.getItem("columns") || "[]"),
    []
  );

  console.log({
    columns,
    rows,
  });

  return (
    <div className="flex flex-col items-center h-screen w-screen justify-center gap-4">
      {rows.length > 0 && visibleColumns.length > 0 && columns.length > 0 ? (
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
          setVisibleColumns={() => {}}
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
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border cursor-pointer border-dashed min-h-80 min-w-[480px] flex flex-col items-center justify-center rounded-xl border-zinc-700"
        >
          {isLoading ? (
            <Spinner color="white" />
          ) : (
            <>
              <BsFiletypeCsv className="text-4xl text-zinc-400" />
              <h1 className="text-xl font-bold">Upload your file</h1>

              <p className="text-sm text-zinc-400">
                Get started by uploading your file. File should be in{" "}
                <span>.csv</span> format
              </p>

              <input
                ref={inputRef}
                hidden
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
              />
            </>
          )}
        </div>
      )}

      <ColumnModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={() => {}}
        columnNames={columnNames}
        rows={rows}
      />
    </div>
  );
};

export default Playground;

