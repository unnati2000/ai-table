"use client";

import { Button, Input, Chip, AvatarGroup, Avatar } from "@nextui-org/react";

import { useTheme } from "next-themes";

import { MdOutlineWbSunny, MdDarkMode } from "react-icons/md";

import { BsStars } from "react-icons/bs";

import { LuSend } from "react-icons/lu";

// import { CiMail } from "react-icons/ci";

import { PiStudentLight } from "react-icons/pi";

import { IoAnalyticsSharp } from "react-icons/io5";

import { GoPeople } from "react-icons/go";

import StudentDataTable from "@/components/student-data/StudentDataTable";

const tableData = [
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

export default function Home() {
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

      <HeroSection />

      <StudentDataTable />

      <div className="fixed flex gap-4  items-center flex-col justify-center bottom-0 text-center h-[calc(100vh-900px)] w-full  backdrop-blur-md">
        <div className="flex items-center gap-2">
          {tableData.map((table) => (
            <Chip
              key={table.slug}
              onClick={() => {
                // router.push(`/${table.slug}`);
              }}
            >
              <p>{table.title}</p>
            </Chip>
          ))}
        </div>

        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Ask AI to hide 'Maths' column"
            size="lg"
            startContent={<BsStars />}
            endContent={
              <Button size="sm" variant="solid" color="primary" isIconOnly>
                <LuSend />
              </Button>
            }
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

