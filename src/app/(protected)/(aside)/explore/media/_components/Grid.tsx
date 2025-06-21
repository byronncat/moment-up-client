import type { DetailedMomentInfo } from "api";
import { useRef, useEffect, useState } from "react";
import { debounce } from "lodash";

import { MomentCell } from "@/components/moment";

import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeGrid } from "react-window";
import { VirtualScrollbar } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";

const COLUMN_COUNT = 3;
const GAP_SIZE = 4;
const TOP_PADDING = 49 + GAP_SIZE; // 49px (header height)
const BOTTOM_PADDING = 36;

type GridProps = Readonly<{
  items: DetailedMomentInfo[];
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => void;
  onItemClick: (index: number) => void;
}>;

export default function Grid({
  items,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  onItemClick,
}: GridProps) {
  const [isResizing, setIsResizing] = useState(false);
  const listRef = useRef<VariableSizeGrid>(null);
  const updateScrollbarRef = useRef<(scrollTop: number) => void>(() => {});

  const remainder = items.length % COLUMN_COUNT;
  const dataRowCount = Math.ceil(items.length / COLUMN_COUNT);

  const needsSkeletonRow = hasNextPage && remainder === 0;
  const skeletonRowCount = needsSkeletonRow ? 1 : 0;

  const rowCount = 1 + dataRowCount + skeletonRowCount + 1; // First & Last padding
  const itemCount = items.length + (hasNextPage ? COLUMN_COUNT : 0);
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  const isItemLoaded = (index: number) => {
    if (!hasNextPage) return true;
    return index < items.length;
  };

  function handleCustomScroll(newScrollTop: number) {
    listRef.current?.scrollTo({ scrollTop: newScrollTop });
  }

  useEffect(() => {
    if (items.length > 0)
      listRef.current?.resetAfterIndices({ rowIndex: 0, columnIndex: 0 });
  }, [items]);

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsResizing(false);
    }, 1000);

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
        const totalHeight =
          TOP_PADDING + (rowCount - 2) * baseRowHeight + BOTTOM_PADDING;

        function getColumnWidth() {
          return baseColumnWidth;
        }

        function getRowHeight(index: number) {
          if (index === 0) return TOP_PADDING;
          if (index === rowCount - 1) return BOTTOM_PADDING;
          return baseRowHeight;
        }

        return (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <>
                <VariableSizeGrid
                  ref={(grid) => {
                    ref(grid);
                    listRef.current = grid;
                  }}
                  columnCount={COLUMN_COUNT}
                  columnWidth={getColumnWidth}
                  rowCount={rowCount}
                  rowHeight={getRowHeight}
                  height={height}
                  width={width}
                  onItemsRendered={(gridProps) => {
                    const { visibleRowStopIndex } = gridProps;
                    const lastVisibleItemIndex = Math.min(
                      itemCount - 1,
                      (visibleRowStopIndex - 1) * COLUMN_COUNT +
                        COLUMN_COUNT -
                        1
                    );

                    onItemsRendered({
                      overscanStartIndex: 0,
                      overscanStopIndex: lastVisibleItemIndex,
                      visibleStartIndex: Math.max(
                        0,
                        (gridProps.visibleRowStartIndex - 1) * COLUMN_COUNT
                      ),
                      visibleStopIndex: lastVisibleItemIndex,
                    });
                  }}
                  onScroll={({ scrollTop }) =>
                    updateScrollbarRef.current?.(scrollTop)
                  }
                  itemData={{
                    items,
                    onClick: onItemClick,
                    rowCount,
                    hasNextPage,
                    dataRowCount,
                    remainder,
                  }}
                  className="scrollbar-hide"
                >
                  {Cell}
                </VariableSizeGrid>
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

type CellProps = Readonly<{
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    items: DetailedMomentInfo[];
    onClick: (index: number) => void;
    rowCount: number;
    hasNextPage: boolean;
    dataRowCount: number;
    remainder: number;
  };
}>;

function Cell({ columnIndex, rowIndex, style, data }: CellProps) {
  const { items, onClick, rowCount, hasNextPage, dataRowCount, remainder } =
    data;

  if (rowIndex === 0) return <div style={style} />;
  if (rowIndex === rowCount - 1) return <div style={style} />;

  const dataIndex = (rowIndex - 1) * COLUMN_COUNT + columnIndex;

  let content = null;
  if (rowIndex <= dataRowCount) {
    if (dataIndex < items.length)
      content = (
        <MomentCell
          data={items[dataIndex]}
          onClick={() => onClick(dataIndex)}
        />
      );
    else if (hasNextPage && remainder > 0 && rowIndex === dataRowCount)
      content = <Skeleton className="aspect-square rounded-none" />;
  } else if (hasNextPage)
    content = <Skeleton className="aspect-square rounded-none" />;

  const cellStyle = {
    ...style,
    paddingLeft: GAP_SIZE,
  };

  return <div style={cellStyle}>{content}</div>;
}
