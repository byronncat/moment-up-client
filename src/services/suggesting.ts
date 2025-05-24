import { mockPopularAccounts, mockSuggestedUsers, mockTrendingTopics } from "@/__mocks__";

import type { API, UserCardInfo, ProfileCardInfo } from "api";
import { HashtagItem } from "schema";

export async function getSuggestedUsers(): Promise<API<UserCardInfo[]>> {
  try {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });

    return {
      success: true,
      message: "ok",
      data: mockSuggestedUsers.slice(3),
    };
  } catch (error) {
    return {
      success: false,
      message: "internal error",
    };
  }
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
  try {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });

    return {
      success: true,
      message: "ok",
      data: mockTrendingTopics,
    };
  } catch (error) {
    return {
      success: false,
      message: "internal error",
    };
  }
}
