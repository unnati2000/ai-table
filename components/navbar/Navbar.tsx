"use client";

import { Button } from "@nextui-org/react";

import { useRouter } from "next/navigation";

import { HiOutlinePencilAlt } from "react-icons/hi";

import { LiaStickyNoteSolid } from "react-icons/lia";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Avatar,
} from "@nextui-org/react";

import { IoLogOutOutline } from "react-icons/io5";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="border-b p-4 flex justify-between items-center border-zinc-800 shadow-lg">
      <h3 className="text-xl font-bold">
        <span className="bg-gradient-to-r from-zinc-500 to-zinc-700 bg-clip-text text-transparent">
          Hyper
        </span>{" "}
        Tables
      </h3>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="solid"
            startContent={<HiOutlinePencilAlt size={18} />}
            color="primary"
            size="sm"
            onPress={() => router.push("/playground")}
          >
            Playground
          </Button>
        </div>

        <Popover>
          <PopoverTrigger>
            <Avatar size="sm" />
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex p-3 items-center gap-2">
              <IoLogOutOutline />
              <p>Logout</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;

