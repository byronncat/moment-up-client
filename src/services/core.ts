import { mockFeed, mockFeeds, mockMoments } from "@/__mocks__";
import type { API, FeedInfo, FeedNotification, DetailedMoment } from "api";
import { PAGE_CONFIG } from "@/constants/clientConfig";

export async function getFeeds(): Promise<API<FeedNotification[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "ok",
        data: mockFeeds,
      });
    }, 1000);
  });
}

export async function getFeed(feedId: string): Promise<API<FeedInfo>> {
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

export async function getMoments(page: number): Promise<API<DetailedMoment[]>> {
  const start = (page - 1) * PAGE_CONFIG.MOMENT_CARD_PAGE;
  const end = start + PAGE_CONFIG.MOMENT_CARD_PAGE;
  const moments = mockMoments.slice(start, end);

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
