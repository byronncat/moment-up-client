"use client";

import type { FeedItemDto, SearchItem } from "api";

import { SearchCategory } from "@/constants/client";
import { SearchItemType } from "@/constants/server";
import {
  MEDIA_COLUMNS,
  POST_BORDER_SIZE,
  POST_FOOTER_HEIGHT,
  POST_HEADER_HEIGHT,
  POST_ITEM_GAP,
  POST_MULTI_TEXT_HEIGHT,
  POST_SINGLE_TEXT_HEIGHT,
  type SectionData,
} from "./constant";

export function isValidFeedItemDto(item: SearchItem): boolean {
  return (
    (item.type === SearchItemType.POST || item.type === SearchItemType.MEDIA) &&
    "post" in item &&
    item.post != null
  );
}

export function calculatePostHeight(
  moment: FeedItemDto,
  width: number
): number {
  let height =
    POST_HEADER_HEIGHT +
    POST_FOOTER_HEIGHT +
    POST_ITEM_GAP +
    2 * POST_BORDER_SIZE;

  if (moment.post.files?.length) {
    if (moment.post.files.length === 1) {
      const file = moment.post.files[0];
      switch (file.aspectRatio) {
        case "square":
          height += width;
          break;
        case "portrait":
          height += (width * 5) / 4;
          break;
        case "landscape":
          height += width / 1.91;
          break;
        default:
          height += width;
      }
    } else height += width;

    if (moment.post.text) height += POST_SINGLE_TEXT_HEIGHT;
  } else if (moment.post.text) height += POST_MULTI_TEXT_HEIGHT;

  return height;
}

export function prepareSectionsData(
  results: SearchItem[],
  type: SearchCategory,
  hasNextPage = false
): SectionData[] {
  const sections: SectionData[] = [];
  sections.push({ type: "top-spacing" });

  switch (type) {
    case SearchCategory.PEOPLE:
      results.forEach((item, index) => {
        sections.push({ type: "item", item, originalIndex: index });
      });
      break;

    case SearchCategory.HASHTAG:
      results.forEach((item, index) => {
        sections.push({ type: "item", item, originalIndex: index });
      });
      break;

    case SearchCategory.POSTS:
      sections.push({ type: "posts-top-padding" });
      results.forEach((item, index) => {
        sections.push({ type: "item", item, originalIndex: index });
      });
      break;

    case SearchCategory.MEDIA:
      sections.push({ type: "media-top-padding" });
      for (let i = 0; i < results.length; i += MEDIA_COLUMNS) {
        const rowItems = results.slice(i, i + MEDIA_COLUMNS);
        sections.push({
          type: "media-row",
          items: rowItems,
          originalIndex: i,
        });
      }
      break;

    default:
      const users = results.filter((item) => item.type === SearchItemType.USER);
      const hashtags = results.filter(
        (item) => item.type === SearchItemType.HASHTAG
      );
      const posts = results.filter((item) => item.type === SearchItemType.POST);

      let isFirstHeader = true;

      if (users.length > 0) {
        sections.push({ type: "header", title: "People", isFirstHeader });
        isFirstHeader = false;
        users.forEach((item, index) => {
          sections.push({ type: "item", item, originalIndex: index });
        });
      }

      if (hashtags.length > 0) {
        sections.push({ type: "header", title: "Trending", isFirstHeader });
        isFirstHeader = false;
        hashtags.forEach((item, index) => {
          sections.push({ type: "item", item, originalIndex: index });
        });
      }

      if (posts.length > 0) {
        sections.push({ type: "header", title: "Posts", isFirstHeader });
        isFirstHeader = false;
        posts.forEach((item, index) => {
          sections.push({ type: "item", item, originalIndex: index });
        });
      }
      break;
  }

  if (hasNextPage) sections.push({ type: "loading-indicator" });

  return sections;
}
