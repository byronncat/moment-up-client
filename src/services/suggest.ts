import { mockPopularAccounts } from "@/__mocks__";
import type { API, ProfileSearchItem } from "api";

import { ApiUrl } from "./api.constant";
import { ReportType } from "@/constants/serverConfig";

export async function reportTopic(
  topicId: string,
  reportType: ReportType,
  csrfToken: string
): API {
  return await fetch(ApiUrl.suggestion.report, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({
      topicId,
      type: reportType,
    }),
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Report submitted successfully",
      };
    })
    .catch(async (error) => {
      return {
        success: false,
        message: error.message,
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
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "internal error",
    };
  }
}
