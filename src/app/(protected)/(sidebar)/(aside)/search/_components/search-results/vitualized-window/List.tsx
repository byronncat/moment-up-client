"use client";

import type { SearchItem as TSearchItem, FeedItemDto } from "api";

import {
  prepareSectionsData,
  isValidFeedItemDto,
  calculatePostHeight,
} from "./helper";

import InfiniteLoader from "react-window-infinite-loader";
import { List, getScrollbarSize } from "react-window";
import VirtualItem from "./Item";

import { SearchCategory } from "@/constants/client";
import { SearchItemType } from "@/constants/server";
import {
  MEDIA_COLUMNS,
  FIRST_HEADER_TOP_PADDING,
  HEADER_HEIGHT,
  SECTION_GAP,
  TOP_SPACING_HEIGHT,
  LOADING_INDICATOR_HEIGHT,
  POSTS_TOP_PADDING_HEIGHT,
  MEDIA_TOP_PADDING_HEIGHT,
  DEFAULT_ITEM_HEIGHT,
  POST_MAX_WIDTH,
  BORDER_SIZE,
} from "./constant";
import { useRef, useState } from "react";

interface VirtualListProps {
  results: TSearchItem[];
  type: SearchCategory;
  onItemClick: (item: TSearchItem) => void;
  hasNextPage?: boolean;
  isValidating?: boolean;
  loadNextPage?: () => void;
}

export default function VirtualList({
  results,
  type,
  onItemClick,
  hasNextPage = false,
  isValidating = false,
  loadNextPage,
}: VirtualListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollbarWidth] = useState(getScrollbarSize);

  const sectionsData = prepareSectionsData(results, type, hasNextPage);
  const itemCount = sectionsData.length;

  const loadMoreItems = isValidating ? () => {} : loadNextPage || (() => {});

  function isItemLoaded(index: number) {
    if (!hasNextPage) return true;
    const section = sectionsData[index];
    return section?.type !== "loading-indicator";
  }

  function getItemSize(index: number, width: number) {
    const section = sectionsData[index];

    if (section.type === "top-spacing") return TOP_SPACING_HEIGHT;
    if (section.type === "header")
      return (
        HEADER_HEIGHT +
        (section.isFirstHeader ? FIRST_HEADER_TOP_PADDING : SECTION_GAP)
      );
    if (section.type === "loading-indicator") return LOADING_INDICATOR_HEIGHT;
    if (section.type === "posts-top-padding") return POSTS_TOP_PADDING_HEIGHT;
    if (section.type === "media-top-padding") return MEDIA_TOP_PADDING_HEIGHT;
    if (section.type === "media-row") return width / MEDIA_COLUMNS;

    if (!section.item) return 0;
    const item = section.item;

    switch (item.type) {
      case SearchItemType.POST:
        if (isValidFeedItemDto(item)) {
          return calculatePostHeight(
            item as FeedItemDto,
            width > POST_MAX_WIDTH ? POST_MAX_WIDTH : width
          );
        }
        return DEFAULT_ITEM_HEIGHT;
      default:
        return DEFAULT_ITEM_HEIGHT;
    }
  }

  return (
    <div className="size-full" ref={containerRef}>
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <>
            <List
              listRef={ref}
              rowCount={itemCount}
              rowHeight={(index) =>
                getItemSize(index, containerRef.current?.clientWidth ?? 0)
              }
              rowComponent={VirtualItem}
              rowProps={{
                results,
                type,
                sectionsData,
                onItemClick,
                baseColumnWidth: 640,
              }}
              onRowsRendered={({ startIndex, stopIndex }) =>
                onItemsRendered({
                  overscanStartIndex: startIndex,
                  overscanStopIndex: stopIndex,
                  visibleStartIndex: startIndex,
                  visibleStopIndex: stopIndex,
                })
              }
              style={{ marginRight: -scrollbarWidth - BORDER_SIZE }}
            />
          </>
        )}
      </InfiniteLoader>
    </div>
  );
}
