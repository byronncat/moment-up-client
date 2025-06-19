"use client";

import type { DetailedMomentInfo } from "api";
import type { Actions } from "@/components/providers/MomentData";

import { useState, useRef, useEffect, useCallback } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useHome } from "../../_providers/Home";
import { debounce } from "lodash";

import { cn } from "@/libraries/utils";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList } from "react-window";
import { VirtualScrollbar } from "@/components";
import { MomentCard } from "@/components/moment";

// Container
const TOP_PADDING = 160;
const BOTTOM_PADDING = 144;
const MOBILE_TOP_PADDING = 56;
const MOBILE_BOTTOM_PADDING = 40;

// Card
const HEADER_HEIGHT = 72;
const FOOTER_HEIGHT = 60;
const SINGLE_TEXT_HEIGHT = 32;
const MULTI_TEXT_HEIGHT = 80;
const BORDER_SIZE = 1;
const ITEM_GAP = 16;

// == Other ==
const SCROLLBAR_WIDTH = 12;

type MomentListProps = Readonly<{
  actions: Actions;
  items: DetailedMomentInfo[];
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => void;
  onItemClick: (index: number) => void;
}>;

export default function MomentList({
  items,
  actions,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  onItemClick,
}: MomentListProps) {
  const { hideFeeds } = useHome();
  const [isResizing, setIsResizing] = useState(false);
  const listRef = useRef<VariableSizeList>(null);
  const updateScrollbarRef = useRef<(scrollTop: number) => void>(() => {});

  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const itemCount = (hasNextPage ? items.length : items.length) + 2; // +2 for top and bottom padding
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  const ActionHandler = {
    ...actions,
    block: async (momentId: string) => {
      await actions.block?.(momentId);
    },
  };

  const resetList = useCallback(() => {
    listRef.current?.resetAfterIndex(0);
  }, []);

  useEffect(() => {
    actions.resetList?.(resetList);
  }, [actions, resetList]);

  const getItemSize = (index: number, width: number) => {
    if (index === 0) return TOP_PADDING + (isMobile ? MOBILE_TOP_PADDING : 0);
    if (index === itemCount - 1)
      return BOTTOM_PADDING + (isMobile ? MOBILE_BOTTOM_PADDING : 0);

    const moment = items[index - 1];
    if (!moment) return 0;

    let height = HEADER_HEIGHT + FOOTER_HEIGHT + ITEM_GAP + 2 * BORDER_SIZE;
    if (moment.post.files?.length) {
      if (moment.post.files.length === 1) {
        const file = moment.post.files[0];
        switch (file.aspect_ratio) {
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
    const handleResize = debounce(() => {
      setIsResizing(false);
    }, 500);

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
            .reduce((a, b) => a + b, 0);

          return (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }) => {
                function handleCustomScroll(newScrollTop: number) {
                  listRef.current?.scrollTo(newScrollTop);
                }

                return (
                  <>
                    <VariableSizeList
                      ref={(list) => {
                        ref(list);
                        listRef.current = list;
                      }}
                      itemCount={itemCount}
                      onItemsRendered={onItemsRendered}
                      itemSize={(index) => getItemSize(index, width)}
                      height={height + 120} // read comment below
                      width={width}
                      onScroll={({ scrollOffset }) =>
                        updateScrollbarRef.current?.(scrollOffset)
                      }
                      itemData={{
                        itemCount,
                        isItemLoaded,
                        items,
                        actions: ActionHandler,
                        onClick: onItemClick,
                      }}
                      itemKey={(index) => {
                        if (index === 0) return "top";
                        if (index === itemCount - 1) return "bottom";
                        return items[index - 1].id;
                      }}
                      className={cn(
                        "scrollbar-hide",
                        "transform transition-transform duration-300",
                        hideFeeds && "-translate-y-[120px]" // 120px = 160px (feed panel height) - 24px (hide button height) - 16px (gap)
                      )}
                    >
                      {Item}
                    </VariableSizeList>
                    <VirtualScrollbar
                      height={height}
                      totalHeight={totalHeight}
                      width={SCROLLBAR_WIDTH}
                      onScroll={handleCustomScroll}
                      onScrollUpdate={(updateFn) => {
                        updateScrollbarRef.current = updateFn;
                      }}
                      className="[@media(max-width:calc(640px+48px+32px))]:hidden"
                    />
                  </>
                );
              }}
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
    items: DetailedMomentInfo[];
    actions: Actions;
    itemCount: number;
    isItemLoaded: (index: number) => boolean;
    onClick: (index: number) => void;
  };
  style: React.CSSProperties;
}>;

function Item({ index, data, style }: ItemProps) {
  if (index === 0) return <div style={style} />;
  if (index === data.itemCount - 1) return <div style={style} />;

  const { isItemLoaded, items, actions, onClick } = data;

  let content;
  const dataIndex = index - 1;
  if (!isItemLoaded(dataIndex)) content = "Loading...";
  else
    content = (
      <MomentCard
        data={items[dataIndex]}
        actions={actions}
        onClick={() => onClick(dataIndex)}
      />
    );

  return <div style={style}>{content}</div>;
}
