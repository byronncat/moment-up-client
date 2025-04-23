import { mockSuggestedUsers, mockTrendingTopics } from "@/__mocks__";

import type { API, SuggestedUser } from "api";

export async function getSuggestedUsers(): Promise<API<SuggestedUser[]>> {
  try {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });

    return {
      success: true,
      message: "ok",
      data: mockSuggestedUsers,
    };
  } catch (error) {
    return {
      success: false,
      message: "internal error",
    };
  }
}

export type TrendingTopic = {
  id: number;
  name: string;
  category: string;
  posts: number;
  isLive?: boolean;
  avatar?: string;
};

export async function getTrendingTopics(): Promise<API<TrendingTopic[]>> {
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
