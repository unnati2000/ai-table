"use client";

import { Button, Chip, Input } from "@nextui-org/react";

import { useRouter } from "next/navigation";

import { useTheme } from "next-themes";

import { MdOutlineWbSunny, MdDarkMode } from "react-icons/md";

import { LuSend } from "react-icons/lu";

import { CiMail } from "react-icons/ci";

import StudentDataTable from "@/components/student-data/StudentDataTable";

const tableData = [
  {
    title: "Student Data",
    Icon: null,
    slug: "student-data",
  },
  {
    title: "Sales Data",
    Icon: null,
    slug: "sales-data",
  },
  {
    title: "Employee Data",
    Icon: null,
    slug: "employee-data",
  },
];

export default function Home() {
  const router = useRouter();

  const { theme } = useTheme();

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

      <div className="mt-16 flex flex-col items-center gap-6">
        {/* fancy div */}
        <div className="absolute -top-10 -left-10 h-[400px] w-[200px] rounded-full -rotate-45 bg-gradient-to-b from-zinc-900 to-zinc-800 blur-3xl" />
        {/* main section */}
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <p className="text-4xl font-bold">AI Tables</p>
            <p className="text-lg text-zinc-600 max-w-xs text-center text-ds-text-secondary">
              AI Tables is a tool that allows you to perform complex queries on
              your data.
            </p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="text-lg font-semibold">
              Want to join our waiting list?
            </p>
            <Input
              placeholder="Add you email to join our waiting list..."
              size="lg"
              startContent={
                <div className="bg-zinc-800 rounded-lg p-2">
                  <CiMail />
                </div>
              }
              className="shadow-md w-96"
              classNames={{
                inputWrapper:
                  "bg-zinc-950 border border-zinc-700 data-[focus=true]:bg-zinc-900 data-[focus=true]:border-zinc-600 data-[hover=true]:bg-zinc-900",
                input: "placeholder:text-zinc-700",
              }}
            />
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
          {tableData.map((table) => (
            <Chip
              key={table.slug}
              onClick={() => {
                router.push(`/${table.slug}`);
              }}
            >
              <p>{table.title}</p>
            </Chip>
          ))}
        </div> */}
      </div>

      <StudentDataTable />

      <div className="fixed flex items-center justify-center bottom-0 text-center h-[calc(100vh-1000px)] w-full  backdrop-blur-md">
        <Input
          placeholder="Search"
          endContent={
            <Button size="sm" isIconOnly>
              <LuSend />
            </Button>
          }
          classNames={{
            base: "flex items-center justify-center",
            mainWrapper: "w-1/2",
            inputWrapper:
              "border border-zinc-600 w-full h-full text-center rounded-lg bg-zinc-900  focus:border-zinc-600",
          }}
        />
      </div>
    </div>
  );
}

