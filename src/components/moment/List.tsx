"use client";

import type { MomentInfo } from "api";
import type { Actions } from "@/components/providers/MomentData";

import { useState, useRef, useEffect, memo } from "react";
import { debounce } from "lodash";
import memoize from "memoize-one";
import { areEqual } from "react-window";
import { PAGE_RELOAD_TIME } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList } from "react-window";
import { VirtualScrollbar } from "@/components/common";
import { MomentCard, MomentSkeleton } from "@/components/moment";

// Container
const PLACEHOLDER_ITEM_COUNT = 2;
const LOADING_INDICATOR_COUNT = 1;
const LOADING_INDICATOR_HEIGHT = 226;

// Card
const HEADER_HEIGHT = 76;
const FOOTER_HEIGHT = 60;
const SINGLE_TEXT_HEIGHT = 28;
const MULTI_TEXT_HEIGHT = 72;
const BORDER_SIZE = 1;
const ITEM_GAP = 16;

// This helper function memoizes incoming props,
// to avoid causing unnecessary re-renders of memoized Item components.
const createItemData = memoize(
  (
    itemCount: number,
    topChildren: React.ReactNode | undefined,
    isItemLoaded: (index: number) => boolean,
    items: MomentInfo[],
    actions: Actions,
    onClick: (index: number) => void,
    itemOptions?: {
      maxWidth?: number;
      className?: string;
    }
  ) => ({
    itemCount,
    topChildren,
    isItemLoaded,
    items,
    actions,
    onClick,
    itemOptions,
  })
);

type MomentListProps = Readonly<{
  items: MomentInfo[];
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => void;
  onItemClick: (index: number) => void;
  actions: Actions;
  listOptions: {
    topChildren?: React.ReactNode;
    topPadding?: number;
    bottomPadding?: number;
    heightOffset?: number;
    listClassName?: string;
  };
  itemOptions?: {
    maxWidth?: number;
    className?: string;
  };
}>;

export default function MomentList({
  items,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  onItemClick,
  actions,
  listOptions,
  itemOptions,
}: MomentListProps) {
  const [isResizing, setIsResizing] = useState(false);
  const listRef = useRef<VariableSizeList>(null);
  const updateScrollbarRef = useRef<(scrollTop: number) => void>(() => {});

  const itemCount =
    items.length +
    PLACEHOLDER_ITEM_COUNT +
    (hasNextPage ? LOADING_INDICATOR_COUNT : 0);
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  function isItemLoaded(index: number) {
    return !hasNextPage || index !== itemCount - 2;
  }

  function handleCustomScroll(newScrollTop: number) {
    listRef.current?.scrollTo(newScrollTop);
  }

  const getItemSize = (index: number, _width: number) => {
    if (index === 0) return listOptions.topPadding ?? 0;
    if (index === itemCount - 1) return listOptions.bottomPadding ?? 0;
    if (hasNextPage && index === itemCount - 2)
      return isNextPageLoading ? LOADING_INDICATOR_HEIGHT : 0;

    let width = _width;
    if (itemOptions?.maxWidth && _width > itemOptions.maxWidth)
      width = itemOptions.maxWidth;
    const moment = items[index - 1];
    if (!moment) return 0;

    let height = HEADER_HEIGHT + FOOTER_HEIGHT + ITEM_GAP + 2 * BORDER_SIZE;
    if (moment.post.files?.length) {
      if (moment.post.files.length === 1) {
        const file = moment.post.files[0];
        switch (file.aspectRatio) {
          case "1:1":
            height += width; // Square
            break;
          case "4:5":
            height += (width * 5) / 4; // Portrait
            break;
          case "1.91:1":
            height += width / 1.91; // Landscape
            break;
          case "9:16":
            height += (width * 16) / 9; // Vertical
            break;
          default:
            height += width; // Default to square
        }
      } else height += width; // Square

      if (moment.post.text) height += SINGLE_TEXT_HEIGHT;
    } else if (moment.post.text) height += MULTI_TEXT_HEIGHT;

    return height;
  };

  useEffect(() => {
    if (items.length > 0) listRef.current?.resetAfterIndex(0);
  }, [items]);

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsResizing(false);
    }, PAGE_RELOAD_TIME);

    const onResize = () => {
      setIsResizing(true);
      handleResize();
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      handleResize.cancel();
    };
  }, []);

  if (isResizing) return null;
  return (
    <>
      <AutoSizer>
        {({ height, width }) => {
          const totalHeight = Array.from({ length: itemCount })
            .map((_, i) => getItemSize(i, width))
            .reduce((a, b) => a + b, 0) - (listOptions.heightOffset ?? 0);

          // Bundle additional data to list items using the "itemData" prop.
          // Memoize this data to avoid bypassing shouldComponentUpdate().
          const itemData = createItemData(
            itemCount,
            listOptions.topChildren,
            isItemLoaded,
            items,
            actions,
            onItemClick,
            itemOptions
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
                    ref={(list) => {
                      ref(list);
                      listRef.current = list;
                    }}
                    itemCount={itemCount}
                    onItemsRendered={onItemsRendered}
                    itemSize={(index) => getItemSize(index, width)}
                    height={height + (listOptions.heightOffset ?? 0)}
                    width={width}
                    onScroll={({ scrollOffset }) =>
                      updateScrollbarRef.current?.(scrollOffset)
                    }
                    itemData={itemData}
                    itemKey={(index) => {
                      if (index === 0) return "top";
                      if (index === itemCount - 1) return "bottom";
                      if (hasNextPage && index === itemCount - 2)
                        return "loading-indicator";
                      return items[index - 1].id || `item-${index}`;
                    }}
                    className={cn("scrollbar-hide", listOptions.listClassName)}
                    aria-label="Moments feed"
                    aria-busy={isNextPageLoading}
                  >
                    {Item}
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
    </>
  );
}

type ItemProps = Readonly<{
  index: number;
  data: {
    items: MomentInfo[];
    actions: Actions;
    itemCount: number;
    topChildren?: React.ReactNode;
    isItemLoaded: (index: number) => boolean;
    onClick: (index: number) => void;
    itemOptions?: {
      maxWidth?: number;
      className?: string;
    };
  };
  style: React.CSSProperties;
}>;

// If list items are expensive to render,
// Consider using React.memo to avoid unnecessary re-renders.
const Item = memo(({ index, data, style }: ItemProps) => {
  if (index === 0) return data.topChildren;
  if (index === data.itemCount - 1) return null;

  const { isItemLoaded, items, actions, onClick } = data;

  let content;
  const dataIndex = index - 1;
  if (isItemLoaded(index))
    content = (
      <MomentCard
        data={items[dataIndex]}
        actions={actions}
        onClick={() => onClick(dataIndex)}
        className={data.itemOptions?.className}
      />
    );
  else
    content = (
      <MomentSkeleton
        haveText
        media="none"
        className={data.itemOptions?.className}
      />
    );

  return <div style={style}>{content}</div>;
}, areEqual);

Item.displayName = "MemoizedItem";
