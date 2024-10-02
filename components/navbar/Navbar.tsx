import { Button } from "@nextui-org/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Avatar,
} from "@nextui-org/react";

import { IoLogOutOutline } from "react-icons/io5";

const Navbar = () => {
  return (
    <div className="border-b p-4 flex justify-between items-center border-zinc-800 shadow-lg">
      <h3 className="text-xl font-bold">Hyper Tables</h3>

      <div className="flex items-center gap-2">
        <Button variant="bordered">Pricing</Button>

        <Popover>
          <PopoverTrigger>
            <Avatar />
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

