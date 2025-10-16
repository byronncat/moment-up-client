"use client";

import type { FeedItemDto, PaginationDto } from "api";

import { useCallback, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useAuth, usePost, useRefreshSWR } from "@/components/providers";
import { getPostHeight } from "@/helpers/ui";
import { ApiUrl } from "@/services/api.constant";
import { INITIAL_PAGE } from "@/constants/server";
import { POST_CARD_LIST_GAP } from "@/constants/client";
import { SWRInfiniteOptions } from "@/helpers/swr";

import { cn } from "@/libraries/utils";
import { FeedCard, PostSkeleton } from "@/components/post";
import { ErrorContent, NoContent } from "@/components/common";
import { Bookmark } from "lucide-react";

export default function BookmarkPage() {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token, user } = useAuth();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationDto<FeedItemDto> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;
    if (!user) return null;

    const url = ApiUrl.post.user(user.id, "bookmark", pageIndex + 1);
    return [url, token.accessToken];
  };

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite(
      getKey,
      ([url, accessToken]) =>
        swrFetcherWithRefresh<PaginationDto<FeedItemDto>>(url, accessToken),
      SWRInfiniteOptions
    );

  const {
    posts,
    setPosts,
    addPosts,
    setCurrentPost,
    like,
    bookmark,
    share,
    report,
    follow,
  } = usePost();

  const hasNextPage = user && (data?.[data.length - 1].hasNextPage ?? true);

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

  const loadNextPage = useCallback(async () => {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }, [hasNextPage, isValidating, setSize, size]);

  useEffect(() => {
    const _posts = data?.flatMap((page) => page.items);
    if (!error && _posts) {
      if (size === INITIAL_PAGE) setPosts(_posts);
      else addPosts(_posts);
    } else setPosts([]);
  }, [data, error, size, setPosts, addPosts]);

  useEffect(() => {
    if (!posts) return;
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (
      lastItem.index >= posts.length - 1 &&
      hasNextPage &&
      !isValidating &&
      user
    )
      loadNextPage();
  }, [user, posts, virtualItems, hasNextPage, isValidating, loadNextPage]);

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
                  onRefresh={() => mutate()}
                  className="pt-16 pb-20"
                />
              ) : posts === undefined ? null : posts.length === 0 ? (
                <NoContent
                  icon={<Bookmark className="size-14 text-muted-foreground" />}
                  title="No bookmarks yet"
                  description="Posts you bookmark will appear here."
                  className="pt-16 pb-20"
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
                    actions={{
                      like,
                      bookmark: async (postId) => {
                        await bookmark(postId);
                        mutate();
                      },
                      share,
                      report,
                      follow,
                    }}
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
