"use client";

import type { DetailedMomentInfo, UserProfileInfo } from "api";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useInfiniteScroll, useChunkRender } from "@/hooks";
import { UserApi } from "@/services";
import { PAGE_CONFIG } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import { NoContent, ErrorContent } from "@/components";
import { MomentCell } from "@/components/moment";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Loader2 } from "lucide-react";

export default function MediaPage() {
  const [isLoaded, setLoaded] = useState(false);
  const isInitialLoading = useRef(false);
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const username = segments.at(-2) as UserProfileInfo["username"];

  const {
    items: media,
    isLoading: isLoadingMore,
    hasMore,
    loaderRef,
    loadMore,
    reset: resetInfiniteScroll,
    error,
  } = useInfiniteScroll<DetailedMomentInfo>();

  const {
    itemsToShow,
    hasMoreChunks,
    chunkLoaderRef,
    reset: resetChunks,
  } = useChunkRender(media ?? [], {
    chunkSize: PAGE_CONFIG.MOMENT_CARD_PAGE,
  });

  const visibleMedia = media?.slice(0, itemsToShow) ?? [];

  const fetchMediaPage = useCallback(
    async (page: number) => {
      if (!username) throw new Error("Username is required");
      const res = await UserApi.getMoments("media", username, page);
      if (res.success) {
        return res.data ?? [];
      }
      throw new Error("Failed to fetch media");
    },
    [username]
  );

  const fetchInitialMedia = useCallback(async () => {
    if (isInitialLoading.current || isLoaded) return;
    isInitialLoading.current = true;

    await loadMore(fetchMediaPage);
    setLoaded(true);
    isInitialLoading.current = false;
  }, [fetchMediaPage, loadMore, isLoaded]);

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
      <>
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
      </>
    );
  } else {
    return (
      <div className="mt-32">
        <NoContent
          icon={<Camera className="size-16 text-muted-foreground" />}
          title="No media yet"
          description="When this user posts media, they'll show up here."
        />
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-3", "gap-1", "px-1 sm:px-0 mt-5")}>
      {content}
    </div>
  );
}
