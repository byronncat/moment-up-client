"use client";

import type { DetailedMomentInfo } from "api";
import { useState, useEffect, useCallback, useRef } from "react";
import { useInfiniteScroll, useChunkRender } from "@/hooks";
import { CoreApi } from "@/services";
import { PAGE_CONFIG } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import { NoContent, ErrorContent } from "@/components";
// import { MomentCard } from "@/components/moment";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function MomentsPage() {
  const [isLoaded, setLoaded] = useState(false);
  const isInitialLoading = useRef(false);

  const {
    items: moments,
    isLoading: isLoadingMore,
    hasMore,
    loaderRef,
    loadMore,
    reset: resetInfiniteScroll,
    error,
  } = useInfiniteScroll<DetailedMomentInfo>();

  const {
    // itemsToShow,
    hasMoreChunks,
    chunkLoaderRef,
    reset: resetChunks,
  } = useChunkRender(moments ?? [], {
    chunkSize: PAGE_CONFIG.MOMENT_CARD_PAGE,
  });

  // const visibleMoments = moments?.slice(0, itemsToShow) ?? [];

  const fetchMomentsPage = useCallback(async (page: number) => {
    const res = await CoreApi.explore("moments", page);
    if (res.success) {
      return res.data ?? [];
    }
    throw new Error("Failed to fetch moments");
  }, []);

  const fetchInitialMoments = useCallback(async () => {
    if (isInitialLoading.current || isLoaded) return;
    isInitialLoading.current = true;

    await loadMore(fetchMomentsPage);
    setLoaded(true);
    isInitialLoading.current = false;
  }, [fetchMomentsPage, loadMore, isLoaded]);

  async function handleRefresh() {
    setLoaded(false);
    resetChunks();
    resetInfiniteScroll();
    await fetchInitialMoments();
  }

  useEffect(() => {
    fetchInitialMoments();
  }, [fetchInitialMoments]);

  let content = null;
  if (!isLoaded) {
    content = (
      <>
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
      </>
    );
  } else if (error) {
    content = <ErrorContent onRefresh={handleRefresh} />;
  } else if (moments && moments.length > 0) {
    const footer = hasMore
      ? isLoadingMore && (
          <div
            className={cn("w-full py-12", "flex justify-center items-center")}
          >
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        )
      : null;

    content = (
      <>
        {/* {visibleMoments.map((moment) => (
          <MomentCard data={moment} key={moment.id} />
        ))} */}
        <div
          ref={chunkLoaderRef}
          className={cn(hasMoreChunks ? "block" : "hidden")}
        />
        <div
          ref={loaderRef}
          className={cn(hasMore && !hasMoreChunks ? "block" : "hidden")}
        />
        {!hasMoreChunks && footer}
      </>
    );
  } else {
    content = (
      <NoContent
        title="No moments found"
        description="Wait for someone to post a moment."
      />
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", "px-3 sm:px-0")}>{content}</div>
  );
}
