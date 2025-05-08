import { mockSuggestedUsers, mockTrendingTopics } from "@/__mocks__";

import type { API, UserInfo } from "api";
import { HashtagItem } from "schema";

export async function getSuggestedUsers(): Promise<API<UserInfo[]>> {
  try {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });

    const startIndex = Math.floor(
      Math.random() * (mockSuggestedUsers.length - 5)
    );
    const endIndex = startIndex + 5;

    return {
      success: true,
      message: "ok",
      data: mockSuggestedUsers.slice(startIndex, endIndex),
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
