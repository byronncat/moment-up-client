"use client";

import type { API, DetailedMoment } from "api";

import { useState, useRef, use, useEffect } from "react";
import memoize from "memoize-one";
import { CoreApi } from "@/services";
import { useHome } from "../_providers/Home";
import { debounce } from "lodash";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_BREAKPOINT } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList } from "react-window";
import { NoContent, ErrorContent, VirtualScrollbar } from "@/components";
import { MomentCard } from "@/components/moment";

type MomentsProps = Readonly<{
  initialRes: Promise<
    API<{
      items: DetailedMoment[];
      hasNextPage: boolean;
    }>
  >;
}>;

type Actions = {
  like: (momentId: string) => void;
  bookmark: (momentId: string) => void;
};

export default function Moments({ initialRes }: MomentsProps) {
  const response = use(initialRes);
  const [moments, setMoments] = useState<DetailedMoment[]>(
    response?.data?.items ?? []
  );
  const [hasNextPage, setHasNextPage] = useState(
    response?.data?.hasNextPage ?? true
  );
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const pageRef = useRef(1);

  async function fetchMoments(page?: number) {
    const res = await CoreApi.getMoments(page ?? pageRef.current + 1);
    if (res.success) {
      setMoments((prev) => [...(prev ?? []), ...(res.data?.items ?? [])]);
      setHasNextPage(res.data?.hasNextPage ?? false);
      pageRef.current = page ?? pageRef.current + 1;
    }
    setIsNextPageLoading(false);
  };

  function like(momentId: string) {
    setMoments((prev) =>
      prev.map((moment) =>
        moment.id === momentId
          ? {
              ...moment,
              post: { ...moment.post, isLiked: !moment.post.isLiked },
            }
          : moment
      )
    );
  }

  function bookmark(momentId: string) {
    setMoments((prev) =>
      prev.map((moment) =>
        moment.id === momentId
          ? {
              ...moment,
              post: { ...moment.post, isBookmarked: !moment.post.isBookmarked },
            }
          : moment
      )
    );
  }

  if (response?.success === false) {
    return (
      <ErrorContent
        onRefresh={() => {
          setIsNextPageLoading(true);
          fetchMoments(1);
        }}
        className="pt-[144px]"
      />
    );
  }

  if (moments.length === 0) {
    return (
      <NoContent
        title="No moments yet"
        description="When anyone you follow posts, they'll show up here."
        className="pt-[144px]"
      />
    );
  }

  return (
    <MomentList
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      items={moments}
      loadNextPage={() => fetchMoments()}
      actions={{ like, bookmark }}
    />
  );
}

// Container
const TOP_PADDING = 160;
const BOTTOM_PADDING = 144;

// Card
const HEADER_HEIGHT = 72;
const FOOTER_HEIGHT = 60;
const SINGLE_TEXT_HEIGHT = 32;
const MULTI_TEXT_HEIGHT = 80;
const BORDER_SIZE = 1;
const ITEM_GAP = 16;

// Mobile
const MOBILE_TOP_PADDING = 56;
const MOBILE_BOTTOM_PADDING = 40;

type ItemProps = Readonly<{
  index: number;
  data: {
    items: DetailedMoment[];
    actions: Actions;
    itemCount: number;
    isItemLoaded: (index: number) => boolean;
  };
  style: React.CSSProperties;
}>;

const Item = ({ index, data, style }: ItemProps) => {
  if (index === 0) return <div style={style} className="h-[160px]" />;
  if (index === data.itemCount - 1)
    return <div style={style} className="h-[120px]" />;

  const { isItemLoaded, items, actions } = data;

  let content;
  const dataIndex = index - 1;
  if (!isItemLoaded(dataIndex)) content = "Loading...";
  else content = <Row data={items[dataIndex]} actions={actions} />;

  return <div style={style}>{content}</div>;
};

function Row({
  data,
  actions,
}: Readonly<{ data: DetailedMoment; actions: Actions }>) {
  return <MomentCard data={data} actions={actions} />;
}

const createItem = memoize(
  (
    itemCount: number,
    isItemLoaded: (index: number) => boolean,
    items: DetailedMoment[],
    actions: Actions
  ) => ({
    itemCount,
    isItemLoaded,
    items,
    actions,
  })
);

type MomentListProps = Readonly<{
  actions: Actions;
  items: DetailedMoment[];
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => void;
}>;

function MomentList({
  items,
  actions,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
}: MomentListProps) {
  const { hideFeeds } = useHome();
  const [scrollTop, setScrollTop] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const listRef = useRef<VariableSizeList>(null);

  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const itemCount = (hasNextPage ? items.length : items.length) + 2; // +2 for top and bottom padding
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;
  const ItemData = createItem(itemCount, isItemLoaded, items, actions);

  const getItemSize = (index: number, width: number) => {
    if (index === 0) return TOP_PADDING + (isMobile ? MOBILE_TOP_PADDING : 0);
    if (index === itemCount - 1) return BOTTOM_PADDING + (isMobile ? MOBILE_BOTTOM_PADDING : 0);

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
      } else {
        height += width; // Square
      }

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
                      onScroll={({ scrollOffset }) => setScrollTop(scrollOffset)}
                      itemData={ItemData}
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
                      width={10}
                      onScroll={handleCustomScroll}
                      scrollTop={scrollTop}
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
