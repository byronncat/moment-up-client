"use client";

import type { FeedItemDto } from "api";
import type { Actions } from "@/components/providers/MomentStorage";

import { memo, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { PAGE_RELOAD_TIME } from "@/constants/client";

import { cn } from "@/libraries/utils";
import InfiniteLoader from "react-window-infinite-loader";
import { List, useListRef } from "react-window";
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

type MomentListProps = Readonly<{
  items: FeedItemDto[];
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
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useListRef(null);
  const updateScrollbarRef = useRef<(scrollTop: number) => void>(() => {});

  const itemCount =
    items.length +
    PLACEHOLDER_ITEM_COUNT +
    (hasNextPage ? LOADING_INDICATOR_COUNT : 0);
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  function isItemLoaded(index: number) {
    return !hasNextPage || index !== itemCount - 2;
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
    // Note: resetAfterIndex is not available in v2, List automatically handles dynamic sizing
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
    <div className="size-full" ref={containerRef}>
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            listRef={(list) => {
              ref(list?.element);
              listRef.current = list;
            }}
            rowCount={itemCount}
            onRowsRendered={({ startIndex, stopIndex }) =>
              onItemsRendered({
                overscanStartIndex: startIndex,
                overscanStopIndex: stopIndex,
                visibleStartIndex: startIndex,
                visibleStopIndex: stopIndex,
              })
            }
            rowHeight={(index) =>
              getItemSize(index, containerRef.current?.clientWidth ?? 0)
            }
            style={{
              height: containerRef.current?.clientHeight ?? 0,
              width: containerRef.current?.clientWidth ?? 0,
            }}
            onScroll={(event) =>
              updateScrollbarRef.current?.(event.currentTarget.scrollTop)
            }
            rowProps={
              {
                itemCount,
                topChildren: listOptions.topChildren,
                isItemLoaded,
                items,
                actions,
                onClick: onItemClick,
                itemOptions,
              } as any
            }
            rowComponent={Item}
            className={cn("scrollbar-hide", listOptions.listClassName)}
            aria-label="Moments story"
            aria-busy={isNextPageLoading}
          />
        )}
      </InfiniteLoader>
    </div>
  );
}

type ItemProps = Readonly<{
  index: number;
  style: React.CSSProperties;
  items: FeedItemDto[];
  actions: Actions;
  itemCount: number;
  topChildren?: React.ReactNode;
  isItemLoaded: (index: number) => boolean;
  onClick: (index: number) => void;
  itemOptions?: {
    maxWidth?: number;
    className?: string;
  };
}>;

// If list items are expensive to render,
// Consider using React.memo to avoid unnecessary re-renders.
const Item = memo(
  ({
    index,
    style,
    items,
    actions,
    itemCount,
    topChildren,
    isItemLoaded,
    onClick,
    itemOptions,
  }: ItemProps) => {
    if (index === 0) return topChildren;
    if (index === itemCount - 1) return null;

    let content;
    const dataIndex = index - 1;
    if (isItemLoaded(index))
      content = (
        <MomentCard
          data={items[dataIndex]}
          actions={actions}
          onClick={() => onClick(dataIndex)}
          className={itemOptions?.className}
        />
      );
    else
      content = (
        <MomentSkeleton
          haveText
          media="none"
          className={itemOptions?.className}
        />
      );

    return <div style={style}>{content}</div>;
  }
);

Item.displayName = "MemoizedItem";
