"use server";

import { prompt } from "@/utils/prompt";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";

import { Column } from "@/types/table";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_KEY,
});

interface FunctionPromptProps<T> {
  data: T[];
  query: string;
  visibleColumns: Column<T>[];
}

export const functionPrompt = async <T>({
  data,
  query,
  visibleColumns,
}: FunctionPromptProps<T>) => {
  const { object } = await generateObject({
    model: openai("gpt-4-turbo", {
      // structuredOutputs: true,
    }),
    output: "no-schema",
    prompt: prompt({ data, query, visibleColumns }),
  });

  return object;
};

