import { mockPopularAccounts } from "@/__mocks__";

import type {
  API,
  Token,
  UserCardDisplayInfo,
  Hashtag,
  ProfileSearchItem,
} from "api";

import { ServerCookie } from "@/helpers/cookie";
import { ApiUrl } from "./api.constant";
import { ReportType } from "@/constants/serverConfig";

export async function getPopularUsers(): API<UserCardDisplayInfo[]> {
  const cookieHeader = ServerCookie.getHeader();
  return await fetch(ApiUrl.suggestion.users, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader && { cookie: cookieHeader }),
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: "Get popular users successful",
        data,
      };
    })
    .catch(async (error) => {
      return {
        success: false,
        message: error.message,
      };
    });
}

export async function getTrendingTopics(): API<Hashtag[]> {
  const cookieHeader = ServerCookie.getHeader();
  return await fetch(ApiUrl.suggestion.trending, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader && { cookie: cookieHeader }),
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: "Get trending topics successful",
        data,
      };
    })
    .catch(async (error) => {
      return {
        success: false,
        message: error.message,
      };
    });
}

export async function reportTopic(
  topicId: string,
  reportType: ReportType,
  csrfToken: Token
): API {
  return await fetch(ApiUrl.suggestion.report, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken && { "X-CSRF-Token": csrfToken }),
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
      console.error("Error reporting topic:", error);
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
