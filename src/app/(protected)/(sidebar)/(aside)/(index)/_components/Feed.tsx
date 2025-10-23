"use client";

import { useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useHomeFeed } from "../_providers/HomeFeed";
import { usePost } from "@/components/providers/PostStorage";
import { getPostHeight } from "@/helpers/ui";
import { MOBILE_NAV_HEIGHT, POST_CARD_LIST_GAP } from "@/constants/client";

import { cn } from "@/libraries/utils";
import { ErrorContent, NoContent } from "@/components/common";
import { FeedCard, PostSkeleton } from "@/components/post";
import Stories from "./stories";
import { FileText } from "lucide-react";
import { useNoMemo } from "@/hooks";

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
  const { posts, setCurrentPost, like, bookmark, share, report, follow } =
    usePost();

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
  const virtualItems = useNoMemo(() => virtualizer.getVirtualItems());

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
  }, [posts, hasNextPage, isNextPageLoading, virtualItems, loadNextPage]);

  return (
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: "relative",
        width: "100%",
        minHeight: `calc(100vh - 2*${MOBILE_NAV_HEIGHT})`,
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
              <div
                className={cn(
                  "max-w-[calc(600px+16px)] px-2 mx-auto",
                  "space-y-4"
                )}
              >
                <PostSkeleton haveText media="horizontal" className="w-full" />
                <PostSkeleton media="square" className="w-full" />
              </div>
            ) : isError ? (
              <ErrorContent onRefresh={reloadPost} className="pt-16 pb-20" />
            ) : !posts ? null : posts.length === 0 ? (
              <NoContent
                icon={<FileText className="size-14 text-muted-foreground" />}
                title="No posts yet"
                description="When anyone you follow posts, they'll show up here."
                className="pt-16 pb-20"
              />
            ) : isLoaderRow ? (
              <div className="max-w-[calc(600px+16px)] px-2 mx-auto">
                <PostSkeleton haveText media="horizontal" className="w-full" />
              </div>
            ) : post ? (
              <div className="max-w-[calc(600px+16px)] px-2 mx-auto">
                <FeedCard
                  data={post}
                  actions={{ like, bookmark, share, report, follow }}
                  onClick={() => setCurrentPost(post.id)}
                  className="w-full"
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
