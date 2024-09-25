"use client";

import { Button, Chip, Input } from "@nextui-org/react";

import { useRouter } from "next/navigation";

import { useTheme } from "next-themes";

import { MdOutlineWbSunny, MdDarkMode } from "react-icons/md";

import { LuSend } from "react-icons/lu";

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

      <div className="mt-28 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-4xl font-medium">AI Tables</p>
          <p className="text-lg text-ds-text-secondary">
            AI Tables is a tool that allows you to create tables with AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
        </div>
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

