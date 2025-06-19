"use client";

import type { DetailedMomentInfo } from "api";
import { useState, useEffect, useCallback, useRef, use } from "react";
import { useInfiniteScroll, useChunkRender } from "@/hooks";
import { UserApi } from "@/services";
import { PAGE_CONFIG } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import { NoContent, ErrorContent } from "@/components";
import {
  //  MomentCard,
  MomentSkeleton,
} from "@/components/moment";
import { Heart, Loader2 } from "lucide-react";

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
        {/* {visibleMoments.map((moment) => (
          <MomentCard key={moment.id} data={moment} />
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
      <div className="mt-32">
        <NoContent
          icon={<Heart className="size-16 text-muted-foreground" />}
          title="No liked moments"
          description="When this user likes moments, they'll show up here."
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", "px-3 sm:px-0")}>{content}</div>
  );
}
