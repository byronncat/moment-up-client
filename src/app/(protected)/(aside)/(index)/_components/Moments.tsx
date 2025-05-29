"use client";

import type { API, DetailedMoment } from "api";

import { useState, useRef, useEffect, useCallback, use } from "react";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { CoreApi } from "@/services";
import { NoContent, ErrorContent } from "@/components";
import { MomentCard, MomentSkeleton } from "@/components/moment";
import NoMoreMoments from "./_components/NoMoreMoments";
import { Loader2 } from "lucide-react";
import InfiniteLoader from "react-window-infinite-loader";

function MomentSkeletons() {
  return (
    <>
      <MomentSkeleton variant="horizontal" />
      <MomentSkeleton variant="square" />
    </>
  );
}

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

  console.log(moments);

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

  // const {
  //   items: moments,
  //   isLoading: isLoadingMore,
  //   hasMore,
  //   loadMore,
  //   reset: resetInfiniteScroll,
  //   error,
  // } = useInfiniteScroll<DetailedMoment>();

  // const fetchInitialMoments = useCallback(async () => {
  //   if (isInitialLoading.current || isLoaded) return;
  //   isInitialLoading.current = true;

  //   await loadMore(fetchMomentsPage);
  //   setLoaded(true);
  //   isInitialLoading.current = false;
  // }, [fetchMomentsPage, loadMore, isLoaded]);

  // async function handleRefresh() {
  //   setLoaded(false);
  //   resetInfiniteScroll();
  //   await fetchInitialMoments();
  // }

  // useEffect(() => {
  //   fetchInitialMoments();
  // }, [fetchInitialMoments]);

  // if (!isLoaded) {
  //   return <MomentSkeletons />;
  // }
  // if (error) {
  //   return <ErrorContent onRefresh={handleRefresh} />;
  // }
  // if (!moments || moments.length === 0) {
  //   return (
  //     <NoContent
  //       title="No moments yet"
  //       description="When anyone you follow posts, they'll show up here."
  //     />
  //   );
  // }

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

  return (
    <AutoSizer>
      {({ height, width }) => (
        // <InfiniteLoader
        //   isItemLoaded={isItemLoaded}
        //   itemCount={itemCount}
        //   loadMoreItems={loadMoreItems}
        // >
        //   {({ onItemsRendered, ref }) => (
        <FixedSizeList
          itemCount={itemCount}
          // onItemsRendered={onItemsRendered}
          // ref={ref}
          itemSize={740}
          height={height}
          width={400}
        >
          {Item}
        </FixedSizeList>
        //   )}
        // </InfiniteLoader>
      )}
    </AutoSizer>
  );
}

function Row({ data }: Readonly<{ data: DetailedMoment }>) {
  return <MomentCard data={data} />;
}
