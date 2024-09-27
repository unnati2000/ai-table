"use client";

import { Skeleton } from "@nextui-org/react";

export const StudentLoadingState = () => {
  return (
    <div className="flex justify-between px-3 py-4">
      <div className="flex w-full items-center gap-1">
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
        <Skeleton className="h-4 w-44  rounded-md" />
      </div>

      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>

      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>
    </div>
  );
};

export const WebAnalyticsLoadingState = () => {
  return (
    <div className="flex justify-between px-3 py-4">
      <div className="flex w-full items-center gap-1">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>
      <div className="flex w-full flex-col gap-1">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>

      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-44  rounded-md" />
      </div>

      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>

      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>

      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>
      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>
    </div>
  );
};

export const HRLoadingState = () => {
  return (
    <div className="flex justify-between px-3 py-4">
      <div className="flex w-full items-center gap-1">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>
      <div className="flex w-full flex-col gap-1">
        <Skeleton className="h-4 w-52 rounded-md" />
      </div>

      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-44  rounded-md" />
      </div>

      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>

      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>

      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>
      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-44 rounded-md" />
      </div>
    </div>
  );
};

