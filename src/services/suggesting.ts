import {
  mockPopularAccounts,
  mockSuggestedUsers,
  mockTrendingTopics,
} from "@/__mocks__";
const apiRes = {
  getSuggestedUsers: "success" as "error" | "success",
  getTrendingTopics: "success" as "error" | "success",
  sendFeedback: "success" as "error" | "success",
};

import type {
  API,
  UserCardDisplayInfo,
  HashtagItem,
  ProfileSearchItem,
} from "api";

export async function getSuggestedUsers(): Promise<API<UserCardDisplayInfo[]>> {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 6000);
  });

  if (apiRes.getSuggestedUsers === "success")
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

export async function getPopularAccounts(): Promise<API<ProfileSearchItem[]>> {
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

export async function getTrendingTopics(): Promise<API<HashtagItem[]>> {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 6000);
  });

  if (apiRes.getTrendingTopics === "success") {
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
