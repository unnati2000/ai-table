"use client";

import { useEffect, useState } from "react";

import {
  Button,
  Textarea,
  Input,
  Chip,
  AvatarGroup,
  Avatar,
} from "@nextui-org/react";

import { toast } from "sonner";

import localFont from "next/font/local";

// import { useTheme } from "next-themes";

// import { MdOutlineWbSunny, MdDarkMode } from "react-icons/md";

import { BsStars } from "react-icons/bs";

import { LuSend } from "react-icons/lu";

import { cn } from "@/lib/utils";

// import { CiMail } from "react-icons/ci";

import { PiStudentLight } from "react-icons/pi";

import { IoAnalyticsSharp } from "react-icons/io5";

import { Column } from "@/types/table";

import {
  StudentLoadingState,
  HRLoadingState,
  WebAnalyticsLoadingState,
} from "@/components/loading-state/LoadingState";

import {
  userTableColumns,
  hrTableColumns,
  webAnalyticsColumns,
} from "@/utils/columns";

import { GoPeople } from "react-icons/go";

// import { Skeleton } from "@nextui-org/react";
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
  // const { theme } = useTheme();

  const [prompt, setPrompt] = useState<string>("");

  const [previousPrompt, setPreviousPrompt] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<
    "student-data" | "web-analytics" | "hr-data"
  >("student-data");

  const [sort, setSort] = useState<Sort>({
    key: "",
    order: "",
  });

  const [visibleColumns, setVisibleColumns] = useState<Column<T>[]>(
    // @ts-expect-error Fix this later
    userTableColumns()
  );

  // @ts-expect-error Fix this later
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

      // @ts-expect-error Fix this later
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

      console.log(responseData.result.data);

      setTableData(responseData.result.data);

      setPreviousPrompt(prompt);

      setPrompt("");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setPrompt("");
    if (selectedTable === "student-data") {
      // @ts-expect-error Fix this later
      setTableData(users);
      // @ts-expect-error Fix this later
      setVisibleColumns(userTableColumns());
      setSelectedData([]);
    } else if (selectedTable === "web-analytics") {
      // @ts-expect-error Fix this later
      setTableData(webAnalyticsData);
      // @ts-expect-error Fix this later
      setVisibleColumns(webAnalyticsColumns());
      setSelectedData([]);
    } else if (selectedTable === "hr-data") {
      // @ts-expect-error Fix this later
      setTableData(hrData);
      // @ts-expect-error Fix this later
      setVisibleColumns(hrTableColumns());
      setSelectedData([]);
    }
  }, [selectedTable]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <nav className="flex justify-end p-3">
        {/* <Button isIconOnly>
          {theme === "light" ? (
            <MdOutlineWbSunny className="" size={20} />
          ) : (
            <MdDarkMode className="" size={20} />
          )}
        </Button> */}
      </nav>

      <div className="flex flex-col gap-12 md:gap-20">
        <HeroSection />

        <div className="mx-8 md:mx-20">
          <Table
            previousPrompt={previousPrompt}
            tableActions={null}
            // @ts-expect-error Fix this later
            columns={
              selectedTable === "student-data"
                ? userTableColumns()
                : selectedTable === "web-analytics"
                ? webAnalyticsColumns()
                : hrTableColumns()
            }
            loadingState={
              selectedTable === "student-data"
                ? StudentLoadingState
                : selectedTable === "web-analytics"
                ? WebAnalyticsLoadingState
                : HRLoadingState
            }
            sortColumn={sort}
            setSortColumn={setSort}
            scrollHeight={800}
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
            tableTitle={
              selectedTable === "student-data"
                ? "Student Data"
                : selectedTable === "web-analytics"
                ? "Web Analytics"
                : "HR Data"
            }
          />
        </div>
      </div>

      <div className="fixed flex gap-4 items-center flex-col justify-center pb-12 pt-4 bottom-0 text-center w-full bg-gradient-to-b from-zinc-900/5 to-zinc-900/30 backdrop-blur-[2px]">
        <div className="flex items-center gap-2">
          {tableItems.map((table) => (
            <Chip
              key={table.slug}
              onClick={() => {
                setSelectedTable(
                  table.slug as "student-data" | "web-analytics" | "hr-data"
                );
              }}
              className={cn(
                "cursor-pointer p-4 ",
                selectedTable === table.slug
                  ? "bg-zinc-300 text-zinc-900"
                  : "bg-gradient-to-r from-zinc-800 border border-zinc-700 to-zinc-900"
              )}
            >
              <p>{table.title}</p>
            </Chip>
          ))}
        </div>

        <div className="flex w-full justify-center items-center gap-2">
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
    </div>
  );
}

const font = localFont({
  src: "../public/fonts/AzeretMono-Medium.woff2",
});

const HeroSection = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    if (!email.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    const response = await fetch("/api/web3forms", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setEmail("");
      toast.success("Thank you for your interest in our product!");
    } else {
      toast.error(
        "Seems like there's some issue from our side, please try again later"
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-12">
      {/* main section */}
      <div className="mt-4 flex flex-col items-center gap-6">
        {/* fancy div */}
        <div className="absolute -top-10 -left-10 h-[400px] w-[200px] rounded-full -rotate-45 bg-gradient-to-b from-zinc-900 to-zinc-800 blur-2xl" />
        {/* main section */}
        <div className="flex mt-12 flex-col items-center gap-6 z-10">
          <div className="flex flex-col max-w-xl text-center items-center gap-2 text-balance">
            <h1 className={cn(font.className, "text-3xl font-bold")}>
              Gather Insights, Interpret and Organise your tables at the speed
              of thought
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <AvatarGroup className="pointer-events-none">
              <Avatar
                name="Amey"
                size="sm"
                src="/amey.jpg"
                classNames={{
                  base: "border-2 border-zinc-900",
                }}
              />
              <Avatar
                name="Akash"
                size="sm"
                src="/ash.jpg"
                classNames={{
                  base: "border-2 border-zinc-900",
                }}
              />
              <Avatar
                name="Nitin"
                size="sm"
                src="/nitinr.jpg"
                classNames={{
                  base: "border-2 border-zinc-900",
                }}
              />
              <Avatar name="+21" size="sm" />
            </AvatarGroup>
            <form onSubmit={handleSubmit}>
              <Input
                placeholder="unnatibamania8@gmail.com"
                size="lg"
                disabled={isLoading}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                classNames={{
                  mainWrapper: "w-72 md:w-96",
                  inputWrapper:
                    "bg-zinc-950 border rounded-full border-zinc-700 data-[focus=true]:bg-zinc-900 data-[focus=true]:border-zinc-600 data-[hover=true]:bg-zinc-900",
                  input: "placeholder:text-zinc-500",
                }}
                endContent={
                  <Button
                    isLoading={isLoading}
                    size="sm"
                    variant="solid"
                    color="primary"
                    isIconOnly
                    className="rounded-full"
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    <LuSend />
                  </Button>
                }
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

