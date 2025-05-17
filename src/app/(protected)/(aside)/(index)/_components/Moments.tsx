"use client";

import type { DetailedMoment } from "api";
import { useEffect, useState, useRef, useCallback } from "react";
import { CoreApi } from "@/services";
import { useInfiniteScroll, useChunkRender } from "@/hooks";
import { PAGE_CONFIG } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import { NoContent, ErrorContent } from "@/components";
import { MomentCard, MomentSkeleton } from "@/components/moment";
import NoMoreMoments from "./NoMoreMoments";
import { Loader2 } from "lucide-react";

export default function Moments() {
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

  const fetchMomentsPage = useCallback(async (page: number) => {
    const res = await CoreApi.getMoments(page);
    if (res.success) {
      return res.data ?? [];
    }
    throw new Error("Failed to fetch moments");
  }, []);

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
    content = <MomentSkeletons />;
  } else if (error) {
    content = <ErrorContent onRefresh={handleRefresh} />;
  } else if (moments && moments.length > 0) {
    const footer = hasMore ? (
      isLoadingMore && (
        <div className={cn("w-full py-12", "flex justify-center items-center")}>
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )
    ) : (
      <NoMoreMoments />
    );

    content = (
      <>
        {visibleMoments.map((moment) => (
          <MomentCard data={moment} key={moment.id} />
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
        title="No moments yet"
        description="When anyone you follow posts, they'll show up here."
      />
    );
  }

  return <Wrapper>{content}</Wrapper>;
}

function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={cn("flex flex-col gap-4", "grow")}>{children}</div>;
}

function MomentSkeletons() {
  return (
    <>
      <MomentSkeleton variant="horizontal" />
      <MomentSkeleton variant="square" />
    </>
  );
}
