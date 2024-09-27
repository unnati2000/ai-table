import { NextRequest, NextResponse } from "next/server";
import { prompt } from "@/utils/prompt";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { Column } from "@/types/table";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_KEY,
});

interface RequestBody<T> {
  data: T[];
  query: string;
  visibleColumns: Column<T>[];
  sortColumn: {
    order: "" | "asc" | "desc";
    key: string;
  };
}

export async function POST<T>(request: NextRequest) {
  try {
    const body: RequestBody<T> = await request.json();
    const { data, query, visibleColumns, sortColumn } = body;

    const { object } = await generateObject({
      model: openai("gpt-3.5-turbo", {
        // structuredOutputs: true,
      }),
      output: "no-schema",
      prompt: prompt({ data, query, visibleColumns, sortColumn }),
    });

    return NextResponse.json({ result: object }, { status: 200 });
  } catch (error) {
    console.error("Error in AI API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const maxDuration = 30;

