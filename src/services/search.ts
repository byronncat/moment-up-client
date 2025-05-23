import { mockSearches } from "@/__mocks__";

import type { z } from "zod";
import type { API, SearchItem } from "api";

import zodSchema from "@/libraries/zodSchema";

export async function search(
  data: z.infer<typeof zodSchema.core.search>
): Promise<API<SearchItem[]>> {
  try {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });

    const filteredData = mockSearches.filter((item) => {
      if (item.type === "user")
        return item.username.toLowerCase().includes(data.query.toLowerCase());
      if (item.type === "hashtag")
        return item.id.toLowerCase().includes(data.query.toLowerCase());
      return item.query.toLowerCase().includes(data.query.toLowerCase());
    });

    return {
      success: true,
      message: "ok",
      data: filteredData,
    };
  } catch (error) {
    return {
      success: false,
      message: "internal error",
    };
  }
}

export async function getSearchHistory(): Promise<API<SearchItem[]>> {
  try {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });

    return {
      success: true,
      message: "ok",
      data: mockSearches,
    };
  } catch (error) {
    return {
      success: false,
      message: "internal error",
    };
  }
}
