"use client";

import type { SearchItem as TSearchItem, MomentInfo } from "api";
import type { SectionData } from "./constant.ts";

import memoize from "memoize-one";
import {
  prepareSectionsData,
  isValidMomentInfo,
  calculatePostHeight,
} from "./helper";

import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList } from "react-window";
import { VirtualScrollbar } from "@/components/common";
import VirtualItem from "./Item";

import { SearchCategory } from "@/constants/clientConfig";
import { SearchItemType } from "@/constants/serverConfig";
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
} from "./constant";

const createItemData = memoize(
  (
    results: TSearchItem[],
    type: SearchCategory,
    sectionsData: SectionData[],
    onItemClick?: (item: TSearchItem) => void,
    baseColumnWidth: number = 0
  ) => ({
    results,
    type,
    sectionsData,
    onItemClick,
    baseColumnWidth,
  })
);

interface VirtualListProps {
  results: TSearchItem[];
  type: SearchCategory;
  onItemClick?: (item: TSearchItem) => void;
  listRef: React.RefObject<VariableSizeList | null>;
  updateScrollbarRef: React.RefObject<(scrollTop: number) => void>;
  handleCustomScroll: (newScrollTop: number) => void;
  hasNextPage?: boolean;
  isValidating?: boolean;
  loadNextPage?: () => void;
}

export default function VirtualList({
  results,
  type,
  onItemClick,
  listRef,
  updateScrollbarRef,
  handleCustomScroll,
  hasNextPage = false,
  isValidating = false,
  loadNextPage,
}: VirtualListProps) {
  const sectionsData = prepareSectionsData(results, type, hasNextPage);
  const itemCount = sectionsData.length;

  const loadMoreItems = isValidating ? () => {} : loadNextPage || (() => {});

  const isItemLoaded = (index: number) => {
    if (!hasNextPage) return true;
    const section = sectionsData[index];
    return section?.type !== "loading-indicator";
  };

  return (
    <AutoSizer>
      {({ height, width }) => {
        const baseColumnWidth = Math.floor(width / MEDIA_COLUMNS);

        const getItemSize = (index: number) => {
          const section = sectionsData[index];

          if (section.type === "top-spacing") return TOP_SPACING_HEIGHT;
          if (section.type === "header")
            return (
              HEADER_HEIGHT +
              (section.isFirstHeader ? FIRST_HEADER_TOP_PADDING : SECTION_GAP)
            );
          if (section.type === "loading-indicator")
            return LOADING_INDICATOR_HEIGHT;
          if (section.type === "posts-top-padding")
            return POSTS_TOP_PADDING_HEIGHT;
          if (section.type === "media-top-padding")
            return MEDIA_TOP_PADDING_HEIGHT;
          if (section.type === "media-row") return baseColumnWidth;

          if (!section.item) return 0;
          const item = section.item;

          switch (item.type) {
            case SearchItemType.POST:
              if (isValidMomentInfo(item)) {
                return calculatePostHeight(
                  item as MomentInfo,
                  width > POST_MAX_WIDTH ? POST_MAX_WIDTH : width
                );
              }
              return DEFAULT_ITEM_HEIGHT;
            default:
              return DEFAULT_ITEM_HEIGHT;
          }
        };

        const totalHeight = Array.from({ length: itemCount })
          .map((_, i) => getItemSize(i))
          .reduce((a, b) => a + b, 0);

        const itemData = createItemData(
          results,
          type,
          sectionsData,
          onItemClick,
          baseColumnWidth
        );

        return (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <>
                <VariableSizeList
                  key={`search-list-${type}`} // Force re-render when category changes
                  ref={(list) => {
                    ref(list);
                    listRef.current = list;
                  }}
                  itemCount={itemCount}
                  itemSize={getItemSize}
                  height={height}
                  width={width}
                  onItemsRendered={onItemsRendered}
                  onScroll={({ scrollOffset }) =>
                    updateScrollbarRef.current?.(scrollOffset)
                  }
                  itemData={itemData}
                  itemKey={(index) => {
                    const section = sectionsData[index];
                    if (section.type === "top-spacing") return `top-spacing`;
                    if (section.type === "header")
                      return `header-${section.title}`;
                    if (
                      section.type === "posts-top-padding" ||
                      section.type === "media-top-padding"
                    )
                      return `top-padding`;
                    if (section.type === "media-row")
                      return `media-row-${index}`;
                    if (section.type === "loading-indicator")
                      return `loading-indicator`;
                    return section.item?.id || `item-${index}`;
                  }}
                  className="scrollbar-hide"
                >
                  {VirtualItem}
                </VariableSizeList>

                <VirtualScrollbar
                  height={height}
                  totalHeight={totalHeight}
                  onScroll={handleCustomScroll}
                  onScrollUpdate={(updateFn) => {
                    updateScrollbarRef.current = updateFn;
                  }}
                  className="[@media(max-width:calc(640px+48px+32px))]:hidden"
                />
              </>
            )}
          </InfiniteLoader>
        );
      }}
    </AutoSizer>
  );
}
