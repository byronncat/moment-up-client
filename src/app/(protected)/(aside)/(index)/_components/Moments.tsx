"use client";

import type { API, DetailedMoment } from "api";

import { useState, useRef, useCallback, useEffect, use } from "react";
import { CoreApi } from "@/services";
import { useHome } from "../_providers/Home";

import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import { NoContent, ErrorContent } from "@/components";
import { MomentCard, MomentSkeleton } from "@/components/moment";
import { VirtualScrollbar } from "@/components/VirtualScrollbar";
import { cn } from "@/libraries/utils";

type MomentsProps = Readonly<{
  initialRes: Promise<
    API<{
      items: DetailedMoment[];
      hasNextPage: boolean;
    }>
  >;
}>;

export default function Moments({ initialRes }: MomentsProps) {
  const response = use(initialRes);
  const [moments, setMoments] = useState<DetailedMoment[]>(
    response?.data?.items ?? []
  );
  const [hasNextPage, setHasNextPage] = useState(
    response?.data?.hasNextPage ?? true
  );
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const page = useRef(1);

  const fetchMoments = useCallback(async () => {
    const res = await CoreApi.getMoments(page.current);
    if (res.success) {
      setMoments((prev) => [...(prev ?? []), ...(res.data?.items ?? [])]);
      setHasNextPage(res.data?.hasNextPage ?? false);
      page.current++;
    }
    setIsNextPageLoading(false);
  }, []);

  if (isNextPageLoading) {
    return (
      <div className="flex flex-col gap-4 pt-[calc(9rem+1rem)]">
        <MomentSkeleton variant="horizontal" />
        <MomentSkeleton variant="square" />
      </div>
    );
  }

  if (response?.success === false) {
    return (
      <ErrorContent
        onRefresh={() => {
          setIsNextPageLoading(true);
          fetchMoments();
        }}
        className="pt-[9rem]"
      />
    );
  }

  if (moments.length === 0) {
    return (
      <NoContent
        title="No moments yet"
        description="When anyone you follow posts, they'll show up here."
        className="pt-[9rem]"
      />
    );
  }

  return (
    <MomentList
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      items={moments}
      loadNextPage={fetchMoments}
    />
  );
}

type MomentListProps = Readonly<{
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  items: DetailedMoment[];
  loadNextPage: () => void;
}>;

const TOP_PADDING = 160;
const BOTTOM_PADDING = 120;
const PLACEHOLDER_ITEM_COUNT = 1;
const MOMENT_GAP = 16;
const BORDER_SIZE = 1;

function MomentList({
  hasNextPage,
  // isNextPageLoading,
  items,
  // loadNextPage,
}: MomentListProps) {
  const { hideFeeds } = useHome();
  const itemCount =
    (hideFeeds ? 0 : 1) +
    PLACEHOLDER_ITEM_COUNT +
    (hasNextPage ? items.length : items.length);
  // const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;
  const [scrollTop, setScrollTop] = useState(0);
  const listRef = useRef<VariableSizeList>(null);

  const handleCustomScroll = useCallback((newScrollTop: number) => {
    if (listRef.current) {
      listRef.current.scrollTo(newScrollTop);
    }
  }, []);

  const getItemSize = useCallback(
    (index: number) => {
      if (!hideFeeds && index === 0) return TOP_PADDING;
      if (index === itemCount - 1) return BOTTOM_PADDING;

      const dataIndex = hideFeeds ? index : index - 1;
      const moment = items[dataIndex];

      if (!moment) return 0;

      // Base height: header (72px) + footer (72px) + padding between sections (16px)
      let height = 72 + 60 + MOMENT_GAP + 2 * BORDER_SIZE;

      if (moment.post.text) {
        if (moment.post.files?.length) height += 32;
        else height += 80;
      }

      if (moment.post.files?.length) {
        const file = moment.post.files[0];
        const maxWidth = 598;

        switch (file.aspect_ratio) {
          case "1:1":
            height += maxWidth; // Square
            break;
          case "9:16":
            height += (maxWidth * 16) / 9; // Tall
            break;
          case "4:5":
            height += (maxWidth * 5) / 4; // Portrait
            break;
          case "1.91:1":
            height += maxWidth / 1.91; // Landscape
            break;
          default:
            height += maxWidth; // Default to square
        }

        height += 16; // Add padding after media
      }

      return height;
    },
    [hideFeeds, itemCount, items]
  );

  const Item = ({
    index,
    style,
  }: Readonly<{ index: number; style: React.CSSProperties }>) => {
    if (!hideFeeds && index === 0) return <div className="h-[160px]" />;
    if (index === itemCount - 1) return <div className="h-[120px]" />;

    let content;
    const dataIndex = hideFeeds ? index : index - 1;
    if (!isItemLoaded(dataIndex)) content = "Loading...";
    else content = <Row data={items[dataIndex]} />;

    return <div style={style}>{content}</div>;
  };

  return (
    <>
      <AutoSizer>
        {({ height, width }) => (
          // <InfiniteLoader
          //   isItemLoaded={isItemLoaded}
          //   itemCount={itemCount}
          //   loadMoreItems={loadMoreItems}
          // >
          //   {({ onItemsRendered, ref }) => (
          <>
            <VariableSizeList
              ref={listRef}
              itemCount={itemCount}
              // onItemsRendered={onItemsRendered}
              // ref={ref}
              itemSize={getItemSize}
              height={height}
              width={width}
              onScroll={({ scrollOffset }) => setScrollTop(scrollOffset)}
              className="scrollbar-hide"
            >
              {Item}
            </VariableSizeList>
            <VirtualScrollbar
              height={height}
              totalHeight={itemCount * 740}
              width={8}
              onScroll={handleCustomScroll}
              scrollTop={scrollTop}
            />
          </>
        )}
      </AutoSizer>
    </>
  );
}

function Row({ data }: Readonly<{ data: DetailedMoment }>) {
  return <MomentCard data={data} />;
}
