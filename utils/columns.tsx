"use client";

import { Column, User } from "../types/table";

export const userTableColumns = (): Column<User>[] => {
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
};

