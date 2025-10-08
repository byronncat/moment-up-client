import type { z } from "zod";
import type { API, ErrorDto, PaginationDto, SearchItem } from "api";
import type { Token } from "@/components/providers/Auth";
import type zodSchema from "@/libraries/zodSchema";

import {
  ApiUrl,
  type SearchSortParams,
  type SearchFilterParams,
} from "./api.constant";
import { parseErrorMessage } from "./helper";

interface SearchData extends z.infer<typeof zodSchema.core.search> {
  filter: SearchFilterParams;
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
      data.filter,
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
