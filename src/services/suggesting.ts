import {
  mockPopularAccounts,
  mockSuggestedUsers,
  mockTrendingTopics,
} from "@/__mocks__";
const apiRes = {
  getSuggestedUsers: "Ok" as "Ok" | "Internal error",
  getTrendingTopics: "Ok" as "Ok" | "Internal error",
  sendFeedback: "Internal error" as "Ok" | "Internal error",
};

import type { API, UserCardInfo, ProfileCardInfo } from "api";
import { HashtagItem } from "schema";

export async function getSuggestedUsers(): Promise<API<UserCardInfo[]>> {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 6000);
  });

  if (apiRes.getSuggestedUsers === "Ok")
    return {
      success: true,
      message: "ok",
      data: mockSuggestedUsers.slice(3),
    };

  return {
    success: false,
    message: "internal error",
  };
}

export async function getPopularAccounts(): Promise<API<ProfileCardInfo[]>> {
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
    return {
      success: false,
      message: "internal error",
    };
  }
}

export async function getTrendingTopics(): Promise<API<HashtagItem[]>> {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 6000);
  });

  if (apiRes.getTrendingTopics === "Ok") {
    return {
      success: true,
      message: "ok",
      data: mockTrendingTopics,
    };
  }

  return {
    success: false,
    message: "internal error",
  };
}

export async function sendFeedback(feedbackId: number): Promise<API<void>> {
  console.log(feedbackId);
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  if (apiRes.sendFeedback === "Ok") {
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
