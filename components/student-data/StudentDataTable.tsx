"use client";

import Table from "@/components/table/Table";
import { Column } from "@/types/table";

import { useMemo, useState } from "react";

import { User } from "@nextui-org/react";

import { data } from "@/lib/data";

import { Skeleton } from "@nextui-org/react";

interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  class: string;
  mathsMarks: number;
  scienceMarks: number;
  englishMarks: number;
}

export default function StudentDataTable({ prompt }: { prompt: string }) {
  const tableColumns: Column<User>[] = useMemo(() => {
    return [
      {
        header: "Name",
        key: "name",
        cell: ({ row }) => (
          <div>
            <p>{row.name}</p>
          </div>
        ),
        label: "Name",
        minWidth: 100,
        maxWidth: 200,
        isSortable: true,
        isResizable: true,
        isRowHeader: true,
        width: 150,
      },
      {
        header: "Class",
        key: "class",
        cell: ({ row }) => <div>{row.class}</div>,
        label: "Class",
        minWidth: 100,
        maxWidth: 200,
        isSortable: true,
        isResizable: true,
        isRowHeader: true,
        width: 150,
      },
      {
        header: "Maths",
        key: "mathsMarks",
        cell: ({ row }) => <div>{row.mathsMarks}</div>,
        label: "Maths",
        minWidth: 100,
        maxWidth: 200,
        isSortable: true,
        isResizable: true,
        isRowHeader: true,
        width: 150,
      },
      {
        header: "Science",
        key: "scienceMarks",
        cell: ({ row }) => <div>{row.scienceMarks}</div>,
        label: "Science",
        minWidth: 100,
        maxWidth: 200,
        isSortable: true,
        isResizable: true,
        isRowHeader: true,
        width: 150,
      },
      {
        header: "English",
        key: "englishMarks",
        cell: ({ row }) => <div>{row.englishMarks}</div>,
        label: "English",
        minWidth: 100,
        maxWidth: 200,
        isSortable: true,
        isResizable: true,
        isRowHeader: true,
        width: 150,
      },
    ];
  }, []);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="h-screen p-10">
      <Table
        // @ts-expect-error: generics error
        columns={tableColumns}
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
        data={data}
        scrollHeight={500}
        // tableId="users"
        isColumnDragEnabled
        isRowDragEnabled
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        searchQuery=""
        setSearchQuery={() => {}}
        selectedData={selectedUsers}
        // @ts-expect-error: generics error
        setSelectedData={setSelectedUsers}
        isAllRowsSelected={false}
        isLastRow={false}
        index={0}
        // setSortColumn={setSort}
        // sortColumn={sort}
        isRowSelectionEnabled
        focusIndex={0}
        isSelectionEnabled={true}
      />
    </div>
  );
}

