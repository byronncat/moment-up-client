"use client";

import type { NotificationInfo } from "api";
import { useRef, useEffect } from "react";

import { cn } from "@/libraries/utils";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList } from "react-window";
import { VirtualScrollbar } from "@/components";
import NotificationItem from "./NotificationItem";
import { NotificationItemSkeleton } from "./NotificationSkeleton";

// Container
const PLACEHOLDER_ITEM_COUNT = 2;
const LOADING_INDICATOR_COUNT = 2;
const LOADING_INDICATOR_HEIGHT = 80;

// Notification Item
const NOTIFICATION_HEIGHT = 80;
const FOLLOW_NOTIFICATION_HEIGHT = 96;
const BORDER_SIZE = 1;

type NotificationListProps = Readonly<{
  items: NotificationInfo[];
  hasNextPage?: boolean;
  isNextPageLoading?: boolean;
  loadNextPage?: () => void;
  onItemClick?: (index: number) => void;
  listOptions?: {
    topChildren?: React.ReactNode;
    topPadding?: number;
    bottomPadding?: number;
    listClassName?: string;
  };
  itemOptions?: {
    maxWidth?: number;
    className?: string;
  };
}>;

export default function NotificationList({
  items,
  hasNextPage = false,
  isNextPageLoading = false,
  loadNextPage = () => {},
  onItemClick = () => {},
  listOptions = {},
  itemOptions,
}: NotificationListProps) {
  const listRef = useRef<VariableSizeList>(null);
  const updateScrollbarRef = useRef<(scrollTop: number) => void>(() => {});

  const itemCount =
    items.length +
    PLACEHOLDER_ITEM_COUNT +
    (hasNextPage ? LOADING_INDICATOR_COUNT : 0);
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  function isItemLoaded(index: number) {
    if (!hasNextPage) return true;
    return index !== itemCount - 2 && index !== itemCount - 3;
  }

  function handleCustomScroll(newScrollTop: number) {
    listRef.current?.scrollTo(newScrollTop);
  }

  const getItemSize = (index: number) => {
    if (index === 0) return listOptions.topPadding ?? 0;
    if (index === itemCount - 1) return listOptions.bottomPadding ?? 0;
    if (index === itemCount - 2 || index === itemCount - 3)
      return LOADING_INDICATOR_HEIGHT;

    const notification = items[index - 1];
    if (!notification) return 0;

    if (
      notification.type === "social" &&
      notification.information.type === "follow"
    ) {
      return FOLLOW_NOTIFICATION_HEIGHT + BORDER_SIZE;
    }

    return NOTIFICATION_HEIGHT + BORDER_SIZE;
  };

  useEffect(() => {
    if (items.length > 0) listRef.current?.resetAfterIndex(0);
  }, [items]);
  return (
    <>
      <AutoSizer>
        {({ height, width }) => {
          const totalHeight = Array.from({ length: itemCount })
            .map((_, i) => getItemSize(i))
            .reduce((a, b) => a + b, 0);

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
                    itemSize={(index) => getItemSize(index)}
                    height={height}
                    width={width}
                    onScroll={({ scrollOffset }) =>
                      updateScrollbarRef.current?.(scrollOffset)
                    }
                    itemData={{
                      itemCount,
                      topChildren: listOptions.topChildren,
                      isItemLoaded,
                      items,
                      onClick: onItemClick,
                      itemOptions,
                    }}
                    itemKey={(index) => {
                      if (index === 0) return "top";
                      if (index === itemCount - 1) return "bottom";
                      if (index === itemCount - 2) return "loading-indicator-1";
                      if (index === itemCount - 3) return "loading-indicator-2";
                      return items[index - 1].id;
                    }}
                    className={cn("scrollbar-hide", listOptions.listClassName)}
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
    items: NotificationInfo[];
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

function Item({ index, data, style }: ItemProps) {
  if (index === 0) return data.topChildren;
  if (index === data.itemCount - 1) return <div style={style} />;

  const { isItemLoaded, items, onClick } = data;

  let content;
  const dataIndex = index - 1;
  if (isItemLoaded(index)) {
    content = (
      <NotificationItem
        data={items[dataIndex]}
        className={data.itemOptions?.className}
        onClick={() => onClick(dataIndex)}
      />
    );
  } else {
    content = (
      <NotificationItemSkeleton className={data.itemOptions?.className} />
    );
  }

  return <div style={style}>{content}</div>;
}
