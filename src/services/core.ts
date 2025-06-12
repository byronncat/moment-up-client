import { mockFeed, mockFeeds, mockMoments } from "@/__mocks__";
import type { API, FeedInfo, FeedNotification, DetailedMoment } from "api";
import { PAGE_CONFIG } from "@/constants/clientConfig";

const apiRes = {
  getMoments: "success" as "error" | "empty" | "success",
  getFeeds: "success" as "error" | "empty" | "success",
};

export async function getFeeds(): Promise<API<FeedNotification[]>> {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 3000);
  });

  if (apiRes.getFeeds === "error") {
    return {
      success: false,
      message: "error",
    };
  }

  if (apiRes.getFeeds === "empty") {
    return {
      success: true,
      message: "ok",
      data: [],
    };
  }

  return {
    success: true,
    message: "ok",
    data: mockFeeds,
  };
}

export async function getFeed(feedId: string): Promise<API<FeedInfo>> {
  console.log("getFeed", feedId);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Make sure mockFeed array exists and has elements
      if (!Array.isArray(mockFeed) || mockFeed.length === 0) {
        resolve({
          success: false,
          message: "Feed data not available",
          data: undefined,
        });
        return;
      }

      // Find the feed with the matching ID, or default to the first feed if not found
      const feed = mockFeed[0];

      resolve({
        success: true,
        message: "ok",
        data: feed,
      });
    }, 1000);
  });
}

export async function getMoments(page: number): Promise<
  API<{
    items: DetailedMoment[];
    hasNextPage: boolean;
  }>
> {
  const start = (page - 1) * PAGE_CONFIG.MOMENT_CARD_PAGE;
  const end = start + PAGE_CONFIG.MOMENT_CARD_PAGE;
  const moments = mockMoments.slice(start, end);

  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (apiRes.getMoments === "error") {
    return {
      success: false,
      message: "error",
    };
  }
  if (apiRes.getMoments === "empty") {
    return {
      success: true,
      message: "ok",
      data: {
        items: [],
        hasNextPage: false,
      },
    };
  }
  return {
    success: true,
    message: "ok",
    data: {
      items: moments,
      hasNextPage: mockMoments.length > PAGE_CONFIG.MOMENT_CARD_PAGE * page,
    },
  };
}

export async function getMoment(
  momentId: string
): Promise<API<DetailedMoment>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "ok",
        data: mockMoments.find((moment) => moment.id === momentId),
      });
    }, 1000);
  });
}

export async function explore(
  type: "media" | "moments",
  page: number
): Promise<API<DetailedMoment[]>> {
  const start =
    (page - 1) *
    (type === "media"
      ? PAGE_CONFIG.MOMENT_CELL_PAGE
      : PAGE_CONFIG.MOMENT_CARD_PAGE);
  const end =
    start +
    (type === "media"
      ? PAGE_CONFIG.MOMENT_CELL_PAGE
      : PAGE_CONFIG.MOMENT_CARD_PAGE);
  const filteredMoments =
    type === "media"
      ? mockMoments.filter(
          (moment) => moment.post.files && moment.post.files.length > 0
        )
      : mockMoments;
  const moments = filteredMoments.slice(start, end);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "ok",
        data: moments,
      });
    }, 1000);
  });
}
