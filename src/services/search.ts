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
        statusCode: response.status,
        data: data.items,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: error.message as string,
        statusCode: error.statusCode,
      };
    });
}

export async function getHistory({
  accessToken,
}: Omit<Token, "csrfToken">): API<SearchItem[]> {
  return await fetch(ApiUrl.search.getHistory(), {
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
        statusCode: response.status,
        data: data.history,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: error.message as string,
        statusCode: error.statusCode,
      };
    });
}

export async function clearHistory({ accessToken, csrfToken }: Token): API {
  return await fetch(ApiUrl.search.clearHistory, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Search history cleared successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: error.message as string,
        statusCode: error.statusCode,
      };
    });
}

export async function removeHistoryItem(
  itemId: string,
  { accessToken, csrfToken }: Token
): API {
  return await fetch(ApiUrl.search.removeHistoryItem(itemId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Search history item removed successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: error.message as string,
        statusCode: error.statusCode,
      };
    });
}
