"use client";

import Table from "@/components/table/Table";
import { Column } from "@/types/table";

import { useMemo, useState } from "react";

import { User } from "@nextui-org/react";

import { data } from "@/lib/data";

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

interface Sort {
  key: string;
  order: "asc" | "desc" | "";
}

export default function Home() {
  const tableColumns: Column<User>[] = useMemo(() => {
    return [
      {
        header: "Name",
        key: "name",
        cell: ({ row }) => (
          <div>
            <User
              name={row.name}
              description={row.email}
              avatarProps={{
                src: row.profileImage,
              }}
              classNames={{
                base: "flex",
                name: "flex",
              }}
            />
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

  const [sort, setSort] = useState<Sort>({
    key: "",
    order: "",
  });

  return (
    <div className="h-screen p-10">
      <Table
        columns={tableColumns}
        data={data}
        // tableId="users"
        isColumnDragEnabled
        isRowDragEnabled
        hasTableHeader={true}
        headerContent={<div></div>}
        isLoading={false}
        searchQuery=""
        setSearchQuery={() => {}}
        selectedData={selectedUsers}
        setSelectedData={setSelectedUsers}
        isAllRowsSelected={false}
        isLastRow={false}
        index={0}
        setSortColumn={setSort}
        sortColumn={sort}
        isRowSelectionEnabled
        focusIndex={0}
        isSelectionEnabled
      />
    </div>
  );
}

