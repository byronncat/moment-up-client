import type { z } from "zod";
import type { API, SearchItem, ErrorResponse } from "api";
import type { Token } from "@/components/providers/Auth";

import zodSchema from "@/libraries/zodSchema";
import { ApiUrl, type SearchQueryParams } from "./api.constant";

interface SearchData extends z.infer<typeof zodSchema.core.search> {
  type: SearchQueryParams;
}

export async function search(
  data: SearchData,
  token: Omit<Token, "csrfToken">
): API<SearchItem[]> {
  return await fetch(ApiUrl.search.search(data.query, data.type), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: "Search performed successfully",
        data: data.items,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        statusCode: error.statusCode,
        success: false,
        message: error.message as string,
      };
    });
}

export async function getSearchHistory({
  accessToken,
}: Omit<Token, "csrfToken">): API<SearchItem[]> {
  return await fetch(ApiUrl.search.history(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: "Search history fetched successfully",
        data: data.history,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        statusCode: error.statusCode,
        success: false,
        message: error.message as string,
      };
    });
}
