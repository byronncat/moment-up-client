"use client";

import { useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useHomeFeed } from "../_providers/HomeFeed";
import {
  useMoment,
  useMomentStore,
} from "@/components/providers/MomentStorage";
import { getPostHeight } from "@/helpers/ui";
import { POST_CARD_LIST_GAP } from "@/constants/client";

import { ErrorContent, NoContent } from "@/components/common";
import { MomentCard, PostSkeleton } from "@/components/moment";
import Stories from "./stories";
import { Camera } from "@/components/icons";

const STORIES_HEIGHT = 121;

export default function VirtualizedFeed() {
  const {
    moments,
    hasNextPage,
    isLoading,
    isError,
    isNextPageLoading,
    loadNextPage,
    reloadPost,
  } = useHomeFeed();
  const { setCurrentIndex, ...momentActions } = useMomentStore();
  const { like, bookmark, follow } = useMoment();

  const itemCount =
    isLoading || isError || moments?.length === 0
      ? 2
      : 1 + (moments?.length ?? 0) + (hasNextPage ? 1 : 0); // Story + Post length + Loading Skeleton

  function handleClick(index: number) {
    setCurrentIndex(index);
  }

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    overscan: 3,
    gap: POST_CARD_LIST_GAP,
    estimateSize: (index) => {
      if (index === 0) return STORIES_HEIGHT;
      return getPostHeight(
        // Add ? after post to avoid undefined error
        moments?.[index - 1]?.post,
        window.innerWidth
      );
    },
  });
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!moments) return;
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (
      lastItem.index - 1 >= moments.length - 1 &&
      hasNextPage &&
      !isNextPageLoading
    )
      loadNextPage();
  }, [moments, virtualItems, hasNextPage, isNextPageLoading, loadNextPage]);

  return (
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: "relative",
        width: "100%",
      }}
    >
      {virtualItems.map((vItem) => {
        const isStoriesRow = vItem.index === 0;
        const isLoaderRow = hasNextPage && vItem.index === itemCount - 1;
        const dataIndex = vItem.index - 1;
        const moment = moments?.[dataIndex];

        return (
          <div
            key={vItem.key}
            data-index={vItem.index}
            ref={(element) => virtualizer.measureElement(element)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${vItem.start}px)`,
            }}
          >
            {isStoriesRow ? (
              <Stories />
            ) : isLoading ? (
              <>
                <PostSkeleton
                  haveText
                  media="horizontal"
                  className="max-w-[600px] mx-auto mb-4"
                />
                <PostSkeleton
                  media="square"
                  className="max-w-[600px] mx-auto"
                />
              </>
            ) : isError ? (
              <ErrorContent onRefresh={reloadPost} className="pt-24" />
            ) : !moments ? null : moments.length === 0 ? (
              <NoContent
                icon={<Camera className="size-16 text-muted-foreground" />}
                title="No moments yet"
                description="When anyone you follow posts, they'll show up here."
                className="pt-24"
              />
            ) : isLoaderRow ? (
              <PostSkeleton
                haveText
                media="horizontal"
                className="max-w-[600px] mx-auto"
              />
            ) : moment ? (
              <MomentCard
                data={moment}
                actions={{ like, bookmark, follow, ...momentActions }}
                onClick={() => handleClick(dataIndex)}
                className="max-w-[600px] mx-auto"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
