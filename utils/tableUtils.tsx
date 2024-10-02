import { Column } from "@/types/table";

export function serializeColumns<T>(columns: Column<T>[]): string {
  return JSON.stringify(columns, (key, value) => {
    if (typeof value === "function") {
      return value.toString();
    }
    return value;
  });
}

// export const deserializeColumns = (columns: string): Column<T>[] => {
//   const parsedColumns: Column<T>[] = JSON.parse(columns);

//   return parsedColumns.map((column) => ({
//     ...column,
//     cell: eval(`(${column.cell.toString()})`),
//   }));
// };

export function deserializeColumns<T>(serializedColumns: string): Column<T>[] {
  try {
    const parsedColumns = JSON.parse(serializedColumns);
    return parsedColumns.map((column: Column<T>) => ({
      ...column,
      cell: ({ row }: { row: T }) => row[column.key as keyof T],
    }));
  } catch (error) {
    console.error("Error deserializing columns:", error);
    return [];
  }
}

