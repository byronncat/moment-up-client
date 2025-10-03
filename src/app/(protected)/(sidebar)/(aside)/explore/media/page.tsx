"use client";

import type { FeedItemDto, PaginationDto } from "api";

import { useCallback, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useAuth, usePost, useRefreshSWR } from "@/components/providers";
import { getMediaHeight } from "@/helpers/ui";
import { ApiUrl } from "@/services/api.constant";
import { POST_GRID_COLUMN_COUNT, POST_GRID_GAP } from "@/constants/client";
import { INITIAL_PAGE } from "@/constants/server";

import { Skeleton } from "@/components/ui/skeleton";
import { MediaCell } from "@/components/post";
import { ErrorContent, NoContent } from "@/components/common";
import { Image as ImageIcon } from "@/components/icons";

const EXPLORER_LIMIT = 50;

export default function MediaPage() {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token, user } = useAuth();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationDto<FeedItemDto> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = ApiUrl.post.explore("media", pageIndex + 1, EXPLORER_LIMIT);
    return [url, token.accessToken];
  };

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite(
      getKey,
      ([url, accessToken]) =>
        swrFetcherWithRefresh<PaginationDto<FeedItemDto>>(url, accessToken),
      {
        initialSize: INITIAL_PAGE,
        revalidateFirstPage: false,
        errorRetryCount: 0,
      }
    );

  const { posts, setPosts, setCurrentPost } = usePost();

  const hasNextPage = user && (data?.[data.length - 1].hasNextPage ?? true);

  const remainder = posts ? posts.length % POST_GRID_COLUMN_COUNT : 0;
  const dataRowCount = posts
    ? Math.ceil(posts.length / POST_GRID_COLUMN_COUNT)
    : 0;
  const needsSkeletonRow = hasNextPage && remainder === 0;
  const skeletonRowCount = needsSkeletonRow ? 1 : 0;
  const itemCount = posts
    ? posts.length === 0 || error
      ? 1
      : dataRowCount + skeletonRowCount
    : isLoading
      ? 1
      : 0;

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    overscan: 3,
    gap: POST_GRID_GAP,
    paddingStart: POST_GRID_GAP,
    paddingEnd: 16,
    estimateSize: () => getMediaHeight(window.innerWidth),
  });
  const virtualItems = virtualizer.getVirtualItems();

  const loadNextPage = useCallback(async () => {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }, [hasNextPage, isValidating, setSize, size]);

  useEffect(() => {
    const allPosts = data?.flatMap((page) => page.items);
    if (!error && allPosts) setPosts(allPosts);
    else setPosts([]);
  }, [data, error, setPosts]);

  useEffect(() => {
    if (!posts) return;
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (
      lastItem.index >= dataRowCount - 1 &&
      hasNextPage &&
      !isValidating &&
      user
    )
      loadNextPage();
  }, [
    user,
    posts,
    virtualItems,
    hasNextPage,
    isValidating,
    loadNextPage,
    dataRowCount,
  ]);

  return (
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: "relative",
        width: "100%",
      }}
    >
      {virtualItems.map((vItem) => {
        const rowIndex = vItem.index;
        const startIndex = rowIndex * POST_GRID_COLUMN_COUNT;
        const isLoaderRow = hasNextPage && rowIndex === itemCount - 1;

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
              <div className="grid grid-cols-3 gap-1 px-1">
                {Array.from({ length: 9 }, (_, index) => (
                  <Skeleton
                    className="aspect-square rounded-none"
                    key={`loading-skeleton-${index}`}
                  />
                ))}
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-20">
                <ErrorContent onRefresh={() => mutate()} />
              </div>
            ) : posts === undefined ? null : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <NoContent
                  icon={
                    <ImageIcon className="size-14 m-1 text-muted-foreground" />
                  }
                  title="No media yet"
                  description="No media posts have been shared yet."
                />
              </div>
            ) : isLoaderRow ? (
              <div className="flex justify-around gap-1 px-1">
                {Array.from(
                  { length: POST_GRID_COLUMN_COUNT },
                  (_, columnIndex) => (
                    <Skeleton
                      key={`skeleton-${columnIndex}`}
                      className="aspect-square rounded-none flex-1"
                    />
                  )
                )}
              </div>
            ) : (
              <div className="flex justify-around gap-1 px-1">
                {Array.from(
                  { length: POST_GRID_COLUMN_COUNT },
                  (_, columnIndex) => {
                    const post = posts?.[startIndex + columnIndex];
                    let content = null;

                    if (rowIndex < dataRowCount) {
                      if (post)
                        content = (
                          <MediaCell
                            data={post}
                            onClick={() => setCurrentPost(post.id)}
                          />
                        );
                      else if (
                        hasNextPage &&
                        remainder > 0 &&
                        rowIndex === dataRowCount - 1
                      )
                        content = (
                          <Skeleton className="aspect-square rounded-none flex-1" />
                        );
                    } else if (hasNextPage)
                      content = (
                        <Skeleton className="aspect-square rounded-none flex-1" />
                      );

                    return (
                      <div
                        key={`col-${vItem.index}-${columnIndex}`}
                        className="flex-1"
                      >
                        {content}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
