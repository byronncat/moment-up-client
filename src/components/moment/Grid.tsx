"use client";

import type { MomentInfo } from "api";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { PAGE_RELOAD_TIME } from "@/constants/client";

import InfiniteLoader from "react-window-infinite-loader";
import { List, type RowComponentProps } from "react-window";
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
  const containerRef = useRef<HTMLDivElement>(null);

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

  function getItemSize(index: number, width: number) {
    if (index === 0) return listOptions?.topPadding ?? 0;
    if (index === itemCount - 1) return listOptions?.bottomPadding ?? 0;
    return width / COLUMN_COUNT;
  }

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
          <>
            <List
              listRef={ref}
              rowCount={itemCount}
              rowHeight={(index) =>
                getItemSize(index, containerRef.current?.clientWidth ?? 0)
              }
              onRowsRendered={({ startIndex, stopIndex }) =>
                onItemsRendered({
                  overscanStartIndex: startIndex,
                  overscanStopIndex: stopIndex,
                  visibleStartIndex: startIndex,
                  visibleStopIndex: stopIndex,
                })
              }
              rowProps={{
                items,
                onClick: onItemClick,
                itemCount,
                hasNextPage,
                dataRowCount,
                remainder,
                topChildren: listOptions?.topChildren,
                width: containerRef.current?.clientWidth ?? 0,
              }}
              rowComponent={Row}
            />
          </>
        )}
      </InfiniteLoader>
    </div>
  );
}

type RowProps = RowComponentProps<{
  items: MomentInfo[];
  onClick: (index: number) => void;
  itemCount: number;
  hasNextPage: boolean;
  dataRowCount: number;
  remainder: number;
  topChildren?: React.ReactNode;
  width: number;
}>;

function Row({
  index,
  style,
  items,
  onClick,
  itemCount,
  hasNextPage,
  dataRowCount,
  remainder,
  topChildren,
  width,
}: RowProps) {
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
          width: width / COLUMN_COUNT,
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
