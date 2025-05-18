"use client";

import type { DetailedMoment } from "api";
import { useState, useEffect, useCallback, useRef, use } from "react";
import { useInfiniteScroll, useChunkRender } from "@/hooks";
import { UserApi } from "@/services";
import { PAGE_CONFIG } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import { NoContent, ErrorContent } from "@/components";
import { MomentCard, MomentSkeleton } from "@/components/moment";
import { Loader2 } from "lucide-react";

export default function LikesPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const [isLoaded, setLoaded] = useState(false);
  const isInitialLoading = useRef(false);
  const username = use(params).username;

  const {
    items: moments,
    isLoading: isLoadingMore,
    hasMore,
    loaderRef,
    loadMore,
    reset: resetInfiniteScroll,
    error,
  } = useInfiniteScroll<DetailedMoment>();

  const {
    itemsToShow,
    hasMoreChunks,
    chunkLoaderRef,
    reset: resetChunks,
  } = useChunkRender(moments ?? [], {
    chunkSize: PAGE_CONFIG.MOMENT_CARD_CHUNK,
  });

  const visibleMoments = moments?.slice(0, itemsToShow) ?? [];

  const fetchMomentsPage = useCallback(
    async (page: number) => {
      if (!username) throw new Error("Username is required");
      const res = await UserApi.getMoments("likes", username, page);
      if (res.success) {
        return res.data ?? [];
      }
      throw new Error("Failed to fetch liked moments");
    },
    [username]
  );

  const fetchInitialMoments = useCallback(async () => {
    if (isInitialLoading.current) return;
    isInitialLoading.current = true;

    try {
      await loadMore(fetchMomentsPage);
    } finally {
      setLoaded(true);
      isInitialLoading.current = false;
    }
  }, [fetchMomentsPage]);

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
        <MomentSkeleton variant="horizontal" />
        <MomentSkeleton variant="square" />
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
        {visibleMoments.map((moment) => (
          <MomentCard key={moment.id} data={moment} />
        ))}
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
        title="No liked moments"
        description="When this user likes moments, they'll show up here."
      />
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", "px-3 sm:px-0")}>{content}</div>
  );
}
