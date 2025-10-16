import type { API, ErrorDto } from "api";
import type { Token } from "@/components/providers/Auth";
import type { TrendingReportType } from "@/constants/server";

import { ApiUrl } from "./api.constant";
import { parseErrorMessage } from "./helper";

interface ReportTopicDto {
  topic: string;
  type: TrendingReportType;
}

export async function reportTopic(data: ReportTopicDto, token: Token): API {
  return fetch(ApiUrl.suggestion.report, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: data.message,
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
