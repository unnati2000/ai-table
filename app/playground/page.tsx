"use client";

import { BsFiletypeCsv } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";

import { ColumnModal } from "@/components/modal/ColumnModal";

import { Spinner } from "@nextui-org/react";

import Table from "@/components/table/Table";

import { Column } from "@/types/table";
import { Textarea } from "@nextui-org/react";
import { BsStars } from "react-icons/bs";
import { LuSend } from "react-icons/lu";
import { Button } from "@nextui-org/react";

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
  // const [prompt, setPrompt] = useState<string>("");
  const [selectedData, setSelectedData] = useState<T[]>([]);
  const [sortColumn, setSortColumn] = useState<{
    key: string;
    order: "asc" | "desc" | "";
  }>({
    key: "",
    order: "",
  });

  const [prompt, setPrompt] = useState<string>("");
  const [previousPrompt, setPreviousPrompt] = useState<string>("");
  const [visibleColumns, setVisibleColumns] = useState<Column<T>[]>([]);
  const [columns, setColumns] = useState<Column<T>[]>([]);

  const [isLoadingAIResponse, setIsLoadingAIResponse] =
    useState<boolean>(false);

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

          const dataRows = lines.slice(1).map((line, index) => {
            const values = line.split(",").map((cell) => cell.trim());
            const row: Record<string, string | number> = {
              id: `row-${index}`,
            };
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

  async function generateResponse() {
    try {
      setIsLoadingAIResponse(true);

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: rows,
          query: prompt,
          visibleColumns,
          sortColumn,
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

      if (responseData.result.selectedData) {
        setSelectedData(responseData.result.selectedData);
      }

      if (responseData.result.sortColumn) {
        setSortColumn(responseData.result.sortColumn);
      }

      setRows(responseData.result.data);

      setPreviousPrompt(prompt);

      setPrompt("");
    } catch (error) {
    } finally {
      setIsLoadingAIResponse(false);
    }
  }

  useEffect(() => {
    const storedColumns = localStorage.getItem("columns") || "[]";
    const deserializedColumns = deserializeColumns<T>(storedColumns);
    setVisibleColumns(deserializedColumns);
    setColumns(deserializedColumns);
  }, [isLoading]); // Empty dependency array

  console.log({ rows, visibleColumns, columns });

  return (
    <div className="flex flex-col items-center h-screen w-screen justify-start gap-4">
      {!isLoadingAIResponse &&
      rows.length > 0 &&
      visibleColumns.length > 0 &&
      columns.length > 0 ? (
        <div className="pt-8 px-16">
          <Table
            columns={columns as Column<T>[]}
            isColumnDragEnabled={JSON.parse(
              localStorage.getItem("isColumnDragEnabled") || "false"
            )}
            isRowDragEnabled={JSON.parse(
              localStorage.getItem("isRowDragEnabled") || "false"
            )}
            tableTitle={JSON.parse(localStorage.getItem("tableName") || "{}")}
            isLoading={false}
            loadingState={() => <div></div>}
            tableData={rows}
            setTableData={() => {}}
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            visibleColumns={visibleColumns as Column<T>[]}
            setVisibleColumns={setVisibleColumns}
            setIsLoading={() => {}}
            tableActions={null}
            hasRightClickMenu
            isRowSelectionEnabled={true}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
            rowActions={[]}
            scrollHeight={400}
            previousPrompt={previousPrompt}
          />

          <div className="flex w-full justify-center fixed bottom-10 items-center gap-2">
            <Textarea
              maxRows={4}
              value={prompt}
              disabled={isLoading}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={"Filter, sort, add columns, etc. with AI"}
              size="lg"
              startContent={<BsStars />}
              endContent={
                <Button
                  onPress={() => {
                    generateResponse();
                  }}
                  disabled={isLoading}
                  isLoading={isLoading}
                  size="sm"
                  variant="solid"
                  color="primary"
                  isIconOnly
                >
                  <LuSend />
                </Button>
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  generateResponse();
                }
              }}
              className="placeholder:text-zinc-800"
              classNames={{
                base: "flex items-center max-w-[600px] justify-center px-4",
                inputWrapper:
                  "border placeholder:transition-opacity placeholder:duration-300 border-zinc-800 w-full h-full text-center rounded-xl bg-zinc-950 data-[hover=true]:bg-zinc-900 data-[active=true]:border-zinc-600",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div
            onClick={() => inputRef.current?.click()}
            className="border cursor-pointer border-dashed min-h-80 min-w-[480px] flex flex-col items-center justify-center rounded-xl border-zinc-700"
          >
            {isLoading ? (
              <Spinner color="white" />
            ) : (
              <>
                <div className="flex flex-col items-center gap-3">
                  <BsFiletypeCsv className="text-5xl text-zinc-400" />

                  <div className="flex flex-col items-center gap-1">
                    <h1 className="text-xl font-bold">Upload your file</h1>

                    <p className="text-sm text-zinc-400">
                      Get started by uploading your file. File should be in{" "}
                      <span>.csv</span> format
                    </p>

                    <Button
                      color="primary"
                      variant="solid"
                      className="mt-4"
                      onPress={() => {
                        const sampleCsv = `id,name,age
                    1,John Doe,25
                    2,Jane Doe,30
                    3,Jim Beam,35`;
                        const blob = new Blob([sampleCsv], {
                          type: "text/csv",
                        });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.style.display = "none";
                        a.href = url;
                        a.download = "sample.csv";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                      }}
                    >
                      Download sample CSV
                    </Button>

                    <input
                      ref={inputRef}
                      hidden
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
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

