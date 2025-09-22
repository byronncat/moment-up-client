// +++ TODO: Ongoing +++
import type { z } from "zod";
import type { API, ErrorDto, PaginationDto, SearchItem } from "api";
import type { Token } from "@/components/providers/Auth";
import type zodSchema from "@/libraries/zodSchema";

import {
  ApiUrl,
  type SearchSortParams,
  type SearchTypeParams,
} from "./api.constant";
import { parseErrorMessage } from "./helper";

interface SearchData extends z.infer<typeof zodSchema.core.search> {
  type: SearchTypeParams;
  order?: SearchSortParams;
  page?: number;
  limit?: number;
}

export async function search(
  data: SearchData,
  token: Omit<Token, "csrfToken">
): API<PaginationDto<SearchItem>> {
  return fetch(
    ApiUrl.search.search(
      data.query,
      data.type,
      data.order,
      data.page,
      data.limit
    ),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
      credentials: "include",
    }
  )
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: "Search performed successfully",
        statusCode: response.status,
        data,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function getHistory({
  accessToken,
}: Omit<Token, "csrfToken">): API<SearchItem[]> {
  return fetch(ApiUrl.search.getHistory(), {
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
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function clearHistory({ accessToken, csrfToken }: Token): API {
  return fetch(ApiUrl.search.clearHistory, {
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
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function removeHistoryItem(
  itemId: string,
  { accessToken, csrfToken }: Token
): API {
  return fetch(ApiUrl.search.removeHistoryItem(itemId), {
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
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}
