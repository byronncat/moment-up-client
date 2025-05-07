import { mockFeed, mockFeeds, mockMoments } from "@/__mocks__";
import type { API, FeedInfo, FeedNotification, DetailedMoment } from "api";

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

const PAGE_SIZE = 5;
export async function getMoments(page: number): Promise<API<DetailedMoment[]>> {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
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
