import { mockPopularAccounts } from "@/__mocks__";
const apiRes = {
  getSuggestedUsers: "success" as "error" | "success",
  getTrendingTopics: "success" as "error" | "success",
  sendFeedback: "success" as "error" | "success",
};

import type { API, UserCardDisplayInfo, Hashtag, ProfileSearchItem } from "api";

import { ServerCookie } from "@/helpers/cookie";
import { ApiUrl } from "./api.constant";

export async function getSuggestedUsers(): API<UserCardDisplayInfo[]> {
  return await fetch(ApiUrl.suggestion.users, {
    method: "GET",
    headers: ServerCookie.getAuthHeaders(),
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: "Get suggested users successful",
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

export async function getTrendingTopics(): API<Hashtag[]> {
  return await fetch(ApiUrl.suggestion.trending, {
    method: "GET",
    headers: ServerCookie.getAuthHeaders(),
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

export async function sendFeedback(feedbackId: number): API<void> {
  console.log("sendFeedback", feedbackId);
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  if (apiRes.sendFeedback === "success") {
    return {
      success: true,
      message: "ok",
    };
  }

  return {
    success: false,
    message: "internal error",
  };
}
