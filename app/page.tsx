"use client";

import { useEffect, useState } from "react";

import { Button, Input, Chip, AvatarGroup, Avatar } from "@nextui-org/react";

import { useTheme } from "next-themes";

import { MdOutlineWbSunny, MdDarkMode } from "react-icons/md";

import { BsStars } from "react-icons/bs";

import { LuSend } from "react-icons/lu";

// import { CiMail } from "react-icons/ci";

import { PiStudentLight } from "react-icons/pi";

import { IoAnalyticsSharp } from "react-icons/io5";

import { Column } from "@/types/table";

import {
  userTableColumns,
  hrTableColumns,
  webAnalyticsColumns,
} from "@/utils/columns";

import { GoPeople } from "react-icons/go";

import { Skeleton } from "@nextui-org/react";
// import StudentDataTable from "@/components/student-data/StudentDataTable";

import { users } from "@/lib/users";
import { webAnalyticsData } from "@/lib/webanalytics";
import { hrData } from "@/lib/hr";

import Table from "@/components/table/Table";

interface Sort {
  key: string;
  order: "asc" | "desc" | "";
}

const tableItems = [
  {
    title: "Student Data",
    Icon: PiStudentLight,
    slug: "student-data",
  },
  {
    title: "Web analytics",
    Icon: IoAnalyticsSharp,
    slug: "web-analytics",
  },
  {
    title: "HR Data",
    Icon: GoPeople,
    slug: "hr-data",
  },
];

export default function Home<T extends { id: string }>() {
  const { theme } = useTheme();

  const [prompt, setPrompt] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<
    "student-data" | "web-analytics" | "hr-data"
  >("student-data");

  const [sort, setSort] = useState<Sort>({
    key: "",
    order: "",
  });

  const [visibleColumns, setVisibleColumns] = useState<Column<T>[]>(
    userTableColumns()
  );
  const [tableData, setTableData] = useState<T[]>(users);
  const [selectedData, setSelectedData] = useState<T[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);

  const deserializeColumns = (columns: string) => {
    const parsedColumns: Column<T>[] = JSON.parse(columns);

    return parsedColumns.map((column) => ({
      ...column,
      cell: eval(`(${column.cell.toString()})`),
    }));
  };

  async function generateResponse() {
    try {
      setIsLoading(true);

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: tableData,
          query: prompt,
          visibleColumns,
          sortColumn: sort,
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
        setSort(responseData.result.sortColumn);
      }

      setPrompt("");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (selectedTable === "student-data") {
      setTableData(users);
      setVisibleColumns(userTableColumns());
      setSelectedData([]);
    } else if (selectedTable === "web-analytics") {
      setTableData(webAnalyticsData);
      setVisibleColumns(webAnalyticsColumns());
      setSelectedData([]);
    } else if (selectedTable === "hr-data") {
      setTableData(hrData);
      setVisibleColumns(hrTableColumns());
      setSelectedData([]);
    }
  }, [selectedTable]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <nav className="flex justify-end p-3">
        <Button isIconOnly>
          {theme === "light" ? (
            <MdOutlineWbSunny className="" size={20} />
          ) : (
            <MdDarkMode className="" size={20} />
          )}
        </Button>
      </nav>

      <div className="flex flex-col gap-6">
        <HeroSection />

        <div className="mx-20">
          <Table
            tableActions={null}
            columns={userTableColumns()}
            loadingState={
              <div className="flex justify-between px-3 py-4">
                <div className="flex w-full items-center gap-1">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-44 rounded-md" />
                    <Skeleton className="h-3 w-36 rounded-md" />
                  </div>
                </div>
                <div className="flex w-full flex-col gap-1">
                  <Skeleton className="h-4 w-44 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
                <div className="flex w-full items-center gap-2">
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>

                <Skeleton className="h-4 w-44  rounded-md" />
                <Skeleton className="h-4 w-44 rounded-md" />
                <Skeleton className="h-4 w-44 rounded-md" />
              </div>
            }
            sortColumn={sort}
            setSortColumn={setSort}
            scrollHeight={600}
            isColumnDragEnabled
            isRowDragEnabled
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            tableData={tableData}
            setTableData={setTableData}
            isRowSelectionEnabled
            tableTitle="Student's Info"
          />
        </div>
      </div>

      <div className="fixed flex gap-4  items-center flex-col justify-center bottom-0 text-center h-[calc(100vh-900px)] w-full  backdrop-blur-md">
        <div className="flex items-center gap-2">
          {tableItems.map((table) => (
            <Chip
              key={table.slug}
              onClick={() => {
                setSelectedTable(
                  table.slug as "student-data" | "web-analytics" | "hr-data"
                );
              }}
              className={`${
                selectedTable === table.slug ? "bg-zinc-800" : "bg-zinc-900"
              } cursor-pointer`}
            >
              <p>{table.title}</p>
            </Chip>
          ))}
        </div>

        <div className="flex w-full items-center gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI to hide 'Maths' column"
            size="lg"
            startContent={<BsStars />}
            endContent={
              <Button
                onPress={() => {
                  generateResponse();
                }}
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
              base: "flex items-center justify-center",
              mainWrapper: "w-1/2",
              inputWrapper:
                "border border-zinc-800 w-full h-full text-center rounded-xl bg-zinc-950 data-[hover=true]:bg-zinc-900 data-[active=true]:border-zinc-600",
            }}
          />
        </div>
      </div>
    </div>
  );
}

const HeroSection = () => {
  return (
    <div className="flex flex-col gap-12">
      {/* main section */}
      <div className="mt-4 flex flex-col items-center gap-6">
        {/* fancy div */}
        <div className="absolute -top-10 -left-10 h-[400px] w-[200px] rounded-full -rotate-45 bg-gradient-to-b from-zinc-900 to-zinc-800 blur-3xl" />
        {/* main section */}
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col max-w-[480px] text-center items-center gap-2">
            <p className="text-4xl font-bold">
              Gather Insights, Intepret and Organise your tables at the speed of
              thought
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AvatarGroup>
              <Avatar
                name="Unnat"
                src="https://avatars.githubusercontent.com/u/56268833?v=4"
              />
              <Avatar
                name="Unnat"
                src="https://avatars.githubusercontent.com/u/56268833?v=4"
              />
              <Avatar
                name="Unnat"
                src="https://avatars.githubusercontent.com/u/56268833?v=4"
              />
            </AvatarGroup>
            <Input
              placeholder="unnatibamania8@gmail.com"
              size="lg"
              className="shadow-md w-96"
              classNames={{
                inputWrapper:
                  "bg-zinc-900 border rounded-full border-zinc-700 data-[focus=true]:bg-zinc-900 data-[focus=true]:border-zinc-600 data-[hover=true]:bg-zinc-900",
                input: "placeholder:text-zinc-700",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

