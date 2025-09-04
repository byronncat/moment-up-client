import type { API, ErrorResponse } from "api";
import type { Token } from "@/components/providers/Auth";

import { ApiUrl } from "./api.constant";
import { TrendingReportType } from "@/constants/server";
import { parseErrorMessage } from "./helper";

interface ReportTopicDto {
  topicId: string;
  type: TrendingReportType;
}

export async function reportTopic(data: ReportTopicDto, token: Token): API {
  return await fetch(ApiUrl.suggestion.report, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({
      topicId: data.topicId,
      type: data.type,
    }),
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Report submitted successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}
