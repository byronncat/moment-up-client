import { useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { usePost } from "@/components/providers";
import { useSearch } from "../../_providers/Search";
import { getPostHeight } from "@/helpers/ui";
import { POST_CARD_LIST_GAP } from "@/constants/client";

import { cn } from "@/libraries/utils";
import { FeedCard, PostSkeleton } from "@/components/post";
import { ErrorContent, NoContent } from "@/components/common";
import { MagnifyingGlass } from "@/components/icons";

export default function PostsList() {
  "use no memo";
  const { posts, setCurrentPost, like, bookmark, share, report, follow } =
    usePost();
  const { isLoading, isValidating, error, hasNextPage, loadNextPage, refresh } =
    useSearch();

  const itemCount = posts
    ? posts.length === 0 || error
      ? 1
      : posts.length + (hasNextPage ? 1 : 0)
    : isLoading
      ? 1
      : 0;

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    overscan: 3,
    gap: POST_CARD_LIST_GAP,
    paddingStart: POST_CARD_LIST_GAP,
    paddingEnd: POST_CARD_LIST_GAP,
    estimateSize: (index) => {
      return getPostHeight(posts?.[index]?.post, window.innerWidth);
    },
  });
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!posts) return;
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (lastItem.index >= posts.length - 1 && hasNextPage && !isValidating)
      loadNextPage();
  }, [posts, hasNextPage, isValidating, virtualItems, loadNextPage]);

  return (
    <div className="max-w-[600px] size-full mx-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
          width: "100%",
        }}
      >
        {virtualItems.map((vItem) => {
          const isLoaderRow = hasNextPage && vItem.index === itemCount - 1;
          const post = posts?.[vItem.index];

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
              {isLoading ? (
                <div
                  className={cn(
                    "max-w-[calc(600px+16px)] px-2 mx-auto",
                    "space-y-4"
                  )}
                >
                  <PostSkeleton
                    haveText
                    media="horizontal"
                    className="w-full"
                  />
                  <PostSkeleton media="square" className="w-full" />
                </div>
              ) : error ? (
                <ErrorContent
                  onRefresh={() => refresh()}
                  className="pt-12 pb-20"
                />
              ) : posts === undefined ? null : posts.length === 0 ? (
                <NoContent
                  icon={
                    <MagnifyingGlass className="size-14 mb-1 text-muted-foreground" />
                  }
                  title="No posts found"
                  description="Try searching for something else."
                  className="pt-12 pb-20"
                />
              ) : isLoaderRow ? (
                <div className="max-w-[calc(600px+16px)] px-2 mx-auto">
                  <PostSkeleton
                    haveText
                    media="horizontal"
                    className="w-full"
                  />
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
    </div>
  );
}
