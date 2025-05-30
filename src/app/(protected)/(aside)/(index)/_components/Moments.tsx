"use client";

import type { API, DetailedMoment } from "api";

import { useState, useRef, useCallback, use } from "react";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { CoreApi } from "@/services";
import { NoContent } from "@/components";
import { MomentCard } from "@/components/moment";
import { VirtualScrollbar } from "@/components/VirtualScrollbar";

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
  const [isLoaded, setLoaded] = useState(false);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const page = useRef(1);

  const fetchMoments = useCallback(async () => {
    const res = await CoreApi.getMoments(page.current);
    if (res.success) {
      setMoments((prev) => [...(prev ?? []), ...(res.data?.items ?? [])]);
      setHasNextPage(res.data?.hasNextPage ?? false);
      setIsNextPageLoading(false);
      setError(null);
      page.current++;
    } else setError(res.message);
  }, []);

  if (!moments || moments.length === 0) {
    return (
      <NoContent
        title="No moments yet"
        description="When anyone you follow posts, they'll show up here."
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

function MomentList({
  hasNextPage,
  isNextPageLoading,
  items,
  loadNextPage,
}: MomentListProps) {
  const itemCount = hasNextPage ? items.length + 1 : items.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;
  const [scrollTop, setScrollTop] = useState(0);
  const listRef = useRef<FixedSizeList>(null);

  const handleCustomScroll = useCallback((newScrollTop: number) => {
    if (listRef.current) {
      listRef.current.scrollTo(newScrollTop);
    }
  }, []);

  const Item = ({
    index,
    style,
  }: Readonly<{ index: number; style: React.CSSProperties }>) => {
    let content;
    if (!isItemLoaded(index)) {
      content = "Loading...";
    } else {
      content = <Row data={items[index]} />;
    }

    return <div style={style}>{content}</div>;
  };

  console.log(items);
  return (
    <>
      <AutoSizer>
        {({ height, width }) => {
          console.log(height, width);
          return (
            // <InfiniteLoader
            //   isItemLoaded={isItemLoaded}
            //   itemCount={itemCount}
            //   loadMoreItems={loadMoreItems}
            // >
            //   {({ onItemsRendered, ref }) => (
            <>
              <FixedSizeList
                ref={listRef}
                itemCount={itemCount}
                // onItemsRendered={onItemsRendered}
                // ref={ref}
                itemSize={740}
                height={height}
                width={width}
                onScroll={({ scrollOffset }) => setScrollTop(scrollOffset)}
                className="scrollbar-hide"
              >
                {Item}
              </FixedSizeList>
              <VirtualScrollbar
                height={height}
                totalHeight={itemCount * 740}
                width={8}
                onScroll={handleCustomScroll}
                scrollTop={scrollTop}
              />
            </>
          );
        }}
      </AutoSizer>
    </>
  );
}

function Row({ data }: Readonly<{ data: DetailedMoment }>) {
  return <MomentCard data={data} />;
}
