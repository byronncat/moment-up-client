import { mockPopularAccounts } from "@/__mocks__";
import type { API, ErrorResponse, ProfileSearchItem } from "api";
import type { Token } from "@/components/providers/Auth";

import { ApiUrl } from "./api.constant";
import { ReportType } from "@/constants/serverConfig";

interface ReportTopicDto {
  topicId: string;
  type: ReportType;
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
        message: error.message as string,
        statusCode: error.statusCode,
      };
    });
}

export async function getPopularAccounts(): API<ProfileSearchItem[]> {
  console.log("getPopularAccounts");
  try {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });

    return {
      success: true,
      message: "ok",
      data: mockPopularAccounts,
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      statusCode: 500,
      message: "internal error",
    };
  }
}
