"use client";

import type { DetailedMoment } from "api";
import { useState, useEffect, useCallback, useRef } from "react";
import { useInfiniteScroll, useChunkRender } from "@/hooks";
import { CoreApi } from "@/services";
import { PAGE_CONFIG } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import { NoContent, ErrorContent } from "@/components";
import { MomentCell } from "@/components/moment";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function MediaPage() {
  const [isLoaded, setLoaded] = useState(false);
  const isInitialLoading = useRef(false);

  const {
    items: media,
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
  } = useChunkRender(media ?? [], {
    chunkSize: PAGE_CONFIG.MOMENT_CELL_CHUNK,
  });

  const visibleMedia = media?.slice(0, itemsToShow) ?? [];

  const fetchMediaPage = useCallback(async (page: number) => {
    const res = await CoreApi.explore("media", page);
    if (res.success) {
      return res.data ?? [];
    }
    throw new Error("Failed to fetch media");
  }, []);

  const fetchInitialMedia = useCallback(async () => {
    if (isInitialLoading.current) return;
    isInitialLoading.current = true;

    try {
      await loadMore(fetchMediaPage);
    } finally {
      setLoaded(true);
      isInitialLoading.current = false;
    }
  }, [fetchMediaPage]);

  async function handleRefresh() {
    setLoaded(false);
    resetChunks();
    resetInfiniteScroll();
    await fetchInitialMedia();
  }

  useEffect(() => {
    fetchInitialMedia();
  }, [fetchInitialMedia]);

  let content = null;
  if (!isLoaded) {
    content = (
      <Wrapper>
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
      </Wrapper>
    );
  } else if (error) {
    content = <ErrorContent onRefresh={handleRefresh} />;
  } else if (media && media.length > 0) {
    const footer = hasMore
      ? isLoadingMore && (
          <div
            className={cn(
              "col-span-3 py-4",
              "flex justify-center items-center"
            )}
          >
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        )
      : null;

    content = (
      <Wrapper>
        {visibleMedia.map((item) => (
          <MomentCell key={item.id} data={item} />
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
      </Wrapper>
    );
  } else {
    content = (
      <div className="h-full grow flex justify-center items-center">
        <NoContent
          title="No media found"
          description="Wait for someone to post a media."
        />
      </div>
    );
  }

  return content;
}

function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cn("grid grid-cols-3", "gap-1", "px-1 sm:px-0")}>
      {children}
    </div>
  );
}
