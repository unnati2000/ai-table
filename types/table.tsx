import { ReactNode } from "react";

export interface Column<T> {
  header: ReactNode;
  label: string;
  key: string;
  minWidth?: number;
  maxWidth?: number;
  isSortable?: boolean;
  isResizable?: boolean;
  isRowHeader?: boolean;
  width?: number | null;
  cell: ({ row }: { row: T }) => ReactNode;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  class: string;
  mathsMarks: number;
  scienceMarks: number;
  englishMarks: number;
}

export interface WebAnalytics {
  date: string;
  website: string;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  source: string;
}

export interface HR {
  name: string;
  email: string;
  phoneNumber: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
}

