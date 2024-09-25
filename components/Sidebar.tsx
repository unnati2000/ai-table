"use client";

import { ListboxItem, Listbox, ListboxSection } from "@nextui-org/react";

import { useRouter } from "next/navigation";

const tablesList = [
  {
    id: "1",
    name: "Student Data",
    path: "/student-data",
  },
  {
    id: "2",
    name: "Teacher Data",
    path: "/table-2",
  },
];

export const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="border-r h-full p-4 border-zinc-800">
      <Listbox>
        <ListboxSection title="Tables">
          {tablesList.map((table) => (
            <ListboxItem key={table.id} onPress={() => router.push(table.path)}>
              {table.name}
            </ListboxItem>
          ))}
        </ListboxSection>
      </Listbox>
    </div>
  );
};

