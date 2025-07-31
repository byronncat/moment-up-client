"use client";

import type { MomentInfo } from "api";
import { useRef, useEffect, useState } from "react";
import { debounce } from "lodash";
import { PAGE_RELOAD_TIME } from "@/constants/clientConfig";

import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList } from "react-window";
import { VirtualScrollbar } from "@/components/common";
import { MomentCell } from "@/components/moment";
import { Skeleton } from "@/components/ui/skeleton";

const COLUMN_COUNT = 3;

type GridProps = Readonly<{
  items: MomentInfo[];
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => void;
  onItemClick: (index: number) => void;
  listOptions?: {
    topChildren?: React.ReactNode;
    topPadding?: number;
    bottomPadding?: number;
  };
}>;

export default function Grid({
  items,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  onItemClick,
  listOptions,
}: GridProps) {
  const [isResizing, setIsResizing] = useState(false);
  const listRef = useRef<VariableSizeList>(null);
  const updateScrollbarRef = useRef<(scrollTop: number) => void>(() => {});

  const remainder = items.length % COLUMN_COUNT;
  const dataRowCount = Math.ceil(items.length / COLUMN_COUNT);

  const needsSkeletonRow = hasNextPage && remainder === 0;
  const skeletonRowCount = needsSkeletonRow ? 1 : 0;

  const itemCount = 1 + dataRowCount + skeletonRowCount + 1; // First & Last padding
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  const isItemLoaded = (index: number) => {
    if (!hasNextPage) return true;
    const itemIndex = (index - 1) * COLUMN_COUNT;
    return itemIndex < items.length;
  };

  function handleCustomScroll(newScrollTop: number) {
    listRef.current?.scrollTo(newScrollTop);
  }

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
    <AutoSizer>
      {({ height, width }) => {
        const baseColumnWidth = Math.floor(width / COLUMN_COUNT);
        const baseRowHeight = baseColumnWidth;

        function getItemSize(index: number) {
          if (index === 0) return listOptions?.topPadding ?? 0;
          if (index === itemCount - 1) return listOptions?.bottomPadding ?? 0;
          return baseRowHeight;
        }

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
                  itemSize={getItemSize}
                  height={height}
                  width={width}
                  onItemsRendered={onItemsRendered}
                  onScroll={({ scrollOffset }) =>
                    updateScrollbarRef.current?.(scrollOffset)
                  }
                  itemData={{
                    items,
                    onClick: onItemClick,
                    itemCount,
                    hasNextPage,
                    dataRowCount,
                    remainder,
                    topChildren: listOptions?.topChildren,
                    baseColumnWidth,
                  }}
                  className="scrollbar-hide"
                  itemKey={(index) => {
                    if (index === 0) return "top";
                    if (index === itemCount - 1) return "bottom";
                    if (hasNextPage && index === itemCount - 2)
                      return "loading-indicator";
                    return (
                      items[(index - 1) * COLUMN_COUNT].id || `item-${index}`
                    );
                  }}
                >
                  {Row}
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

type RowProps = Readonly<{
  index: number;
  style: React.CSSProperties;
  data: {
    items: MomentInfo[];
    onClick: (index: number) => void;
    itemCount: number;
    hasNextPage: boolean;
    dataRowCount: number;
    remainder: number;
    topChildren?: React.ReactNode;
    baseColumnWidth: number;
  };
}>;

function Row({ index, style, data }: RowProps) {
  const {
    items,
    onClick,
    itemCount,
    hasNextPage,
    dataRowCount,
    remainder,
    topChildren,
    baseColumnWidth,
  } = data;

  if (index === 0) return <div style={style}>{topChildren}</div>;
  if (index === itemCount - 1) return <div style={style} />;

  const rowIndex = index - 1;
  const startIndex = rowIndex * COLUMN_COUNT;

  return (
    <div style={style} className="flex justify-around gap-1 px-1">
      {Array.from({ length: COLUMN_COUNT }).map((_, columnIndex) => {
        const dataIndex = startIndex + columnIndex;
        let content = null;

        if (rowIndex < dataRowCount) {
          if (dataIndex < items.length)
            content = (
              <MomentCell
                data={items[dataIndex]}
                onClick={() => onClick(dataIndex)}
              />
            );
          else if (
            hasNextPage &&
            remainder > 0 &&
            rowIndex === dataRowCount - 1
          )
            content = <Skeleton className="aspect-square rounded-none" />;
        } else if (hasNextPage)
          content = <Skeleton className="aspect-square rounded-none" />;

        const cellStyle = {
          width: baseColumnWidth,
        };

        return (
          <div key={columnIndex} style={cellStyle}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
