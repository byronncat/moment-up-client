"use client";

import { useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useHomeFeed } from "../_providers/HomeFeed";
import { useMoment } from "@/components/providers/PostStorage";
import { getPostHeight } from "@/helpers/ui";
import { POST_CARD_LIST_GAP } from "@/constants/client";

import { ErrorContent, NoContent } from "@/components/common";
import { FeedCard, PostSkeleton } from "@/components/post";
import Stories from "./stories";
import { Camera } from "@/components/icons";

const STORIES_HEIGHT = 121;

export default function VirtualizedFeed() {
  const {
    hasNextPage,
    isLoading,
    isError,
    isNextPageLoading,
    loadNextPage,
    reloadPost,
  } = useHomeFeed();
  const { posts, like, bookmark, follow, setCurrentPost, ...PostActions } =
    useMoment();

  const itemCount =
    isLoading || isError || posts?.length === 0
      ? 2
      : 1 + (posts?.length ?? 0) + (hasNextPage ? 1 : 0); // Story + Post length + Loading Skeleton

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    overscan: 3,
    gap: POST_CARD_LIST_GAP,
    paddingEnd: POST_CARD_LIST_GAP,
    estimateSize: (index) => {
      if (index === 0) return STORIES_HEIGHT;
      return getPostHeight(
        // Add ? after post to avoid undefined error
        posts?.[index - 1]?.post,
        window.innerWidth
      );
    },
  });
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!posts) return;
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (
      lastItem.index - 1 >= posts.length - 1 &&
      hasNextPage &&
      !isNextPageLoading
    )
      loadNextPage();
  }, [posts, virtualItems, hasNextPage, isNextPageLoading, loadNextPage]);

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
        const post = posts?.[dataIndex];

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
            ) : !posts ? null : posts.length === 0 ? (
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
            ) : post ? (
              <FeedCard
                data={post}
                actions={{ like, bookmark, follow, ...PostActions }}
                onClick={() => setCurrentPost(post.id)}
                className="max-w-[600px] mx-auto"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
