"use client";

import type { NotificationInfo } from "api";
import { useState } from "react";
import { NotificationType } from "@/constants/serverConfig";

import InfiniteLoader from "react-window-infinite-loader";
import { List, type RowComponentProps, getScrollbarSize } from "react-window";
import NotificationItem from "./Item";
import { NotificationItemSkeleton } from "./Skeleton";

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
  const [scrollbarWidth] = useState(getScrollbarSize);

  const itemCount =
    items.length +
    PLACEHOLDER_ITEM_COUNT +
    (hasNextPage ? LOADING_INDICATOR_COUNT : 0);

  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  function isItemLoaded(index: number) {
    if (!hasNextPage) return true;
    return index !== itemCount - 2 && index !== itemCount - 3;
  }

  const getItemSize = (index: number) => {
    if (index === 0) return listOptions.topPadding ?? 0;
    if (index === itemCount - 1) return listOptions.bottomPadding ?? 0;
    if (!isItemLoaded(index)) return LOADING_INDICATOR_HEIGHT;

    const dataIndex = index - 1;
    const notification = items[dataIndex];

    if (
      notification.type === NotificationType.SOCIAL &&
      notification.information.type === NotificationType.FOLLOW
    )
      return FOLLOW_NOTIFICATION_HEIGHT + BORDER_SIZE;

    return NOTIFICATION_HEIGHT + BORDER_SIZE;
  };

  return (
    <>
      <InfiniteLoader
        itemCount={itemCount}
        isItemLoaded={isItemLoaded}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <>
            <List
              listRef={ref}
              rowCount={itemCount}
              rowHeight={(index) => getItemSize(index)}
              rowComponent={Item}
              rowProps={{
                topChildren: listOptions.topChildren,
                items,
                itemCount,
                itemOptions,
                isItemLoaded,
                onClick: onItemClick,
              }}
              onRowsRendered={({ startIndex, stopIndex }) =>
                onItemsRendered({
                  overscanStartIndex: startIndex,
                  overscanStopIndex: stopIndex,
                  visibleStartIndex: startIndex,
                  visibleStopIndex: stopIndex,
                })
              }
              className={listOptions.listClassName}
              style={{ marginRight: -scrollbarWidth - BORDER_SIZE }}
            />
          </>
        )}
      </InfiniteLoader>
    </>
  );
}

type ItemRowProps = Readonly<{
  topChildren?: React.ReactNode;
  items: NotificationInfo[];
  itemCount: number;
  itemOptions?: {
    maxWidth?: number;
    className?: string;
  };
  isItemLoaded: (index: number) => boolean;
  onClick: (index: number) => void;
}>;

type ItemProps = RowComponentProps<ItemRowProps>;

function Item(props: ItemProps) {
  const {
    index,
    style,
    topChildren,
    items,
    itemCount,
    itemOptions,
    isItemLoaded,
    onClick,
  } = props;

  if (index === 0) return topChildren;
  if (index === itemCount - 1) return <div style={style} />;

  let content;
  if (isItemLoaded(index)) {
    const dataIndex = index - 1;
    const item = items[dataIndex];
    content = (
      <NotificationItem
        data={item}
        className={itemOptions?.className}
        onClick={() => onClick(dataIndex)}
      />
    );
  } else
    content = <NotificationItemSkeleton className={itemOptions?.className} />;

  return <div style={style}>{content}</div>;
}
