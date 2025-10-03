"use client";

import type { FeedItemDto, PaginationDto } from "api";

import { useCallback, useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useAuth, usePost, useRefreshSWR } from "@/components/providers";
import { useProfile } from "../_providers/ProfileProvider";
import { getMediaHeight } from "@/helpers/ui";
import { ApiUrl } from "@/services/api.constant";
import { ROUTE } from "@/constants/route";
import { POST_GRID_COLUMN_COUNT, POST_GRID_GAP } from "@/constants/client";
import { INITIAL_PAGE } from "@/constants/server";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorContent, NoContent } from "@/components/common";
import { MediaCell } from "@/components/post";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileZone, { PROFILE_ZONE_HEIGHT } from "./ProfileZone";
import { Image as ImageIcon } from "@/components/icons";

const ITEMS_EACH_PAGE = 21;

export default function PostGrid() {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token } = useAuth();
  const { profile, isSelf } = useProfile();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationDto<FeedItemDto> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = ApiUrl.post.user(
      profile.id,
      "media",
      pageIndex + 1,
      ITEMS_EACH_PAGE
    );
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

  const { posts, setPosts, addPosts, setCurrentPost } = usePost();

  const hasNextPage = data?.[data.length - 1].hasNextPage ?? true;

  const remainder = posts ? posts.length % POST_GRID_COLUMN_COUNT : 0;
  const dataRowCount = posts
    ? Math.ceil(posts.length / POST_GRID_COLUMN_COUNT)
    : 0;
  const needsSkeletonRow = hasNextPage && remainder === 0;
  const skeletonRowCount = needsSkeletonRow ? 1 : 0;
  const itemCount = posts
    ? posts.length === 0 || error
      ? 2 // Profile + Content
      : 1 + dataRowCount + skeletonRowCount // Profile + Data rows + Skeleton row
    : isLoading
      ? 2
      : 1; // Profile only

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    overscan: 3,
    gap: POST_GRID_GAP,
    paddingEnd: 16,
    estimateSize: (index) => {
      if (index === 0) return PROFILE_ZONE_HEIGHT;
      return getMediaHeight(window.innerWidth);
    },
  });
  const virtualItems = virtualizer.getVirtualItems();

  const loadNextPage = useCallback(async () => {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }, [hasNextPage, isValidating, setSize, size]);

  useEffect(() => {
    const lastPage = data?.[data.length - 1];
    const _posts = lastPage?.items;
    if (!error && _posts) {
      if (size === INITIAL_PAGE) setPosts(_posts);
      else addPosts(_posts);
    } else setPosts([]);
  }, [data, error, size, setPosts, addPosts]);

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (lastItem.index - 1 >= dataRowCount - 1 && hasNextPage && !isValidating)
      loadNextPage();
  }, [
    posts,
    virtualItems,
    hasNextPage,
    isValidating,
    dataRowCount,
    loadNextPage,
  ]);

  const prevIsFollowingRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (
      prevIsFollowingRef.current !== undefined &&
      prevIsFollowingRef.current !== profile.isFollowing
    )
      mutate();

    prevIsFollowingRef.current = profile.isFollowing;
  }, [profile.isFollowing, mutate]);

  return (
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: "relative",
        width: "100%",
      }}
    >
      {virtualItems.map((vItem) => {
        const isProfileRow = vItem.index === 0;
        const rowIndex = vItem.index - 1;
        const startIndex = rowIndex * POST_GRID_COLUMN_COUNT;

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
            {isProfileRow && profile ? (
              <ProfileZone />
            ) : isLoading ? (
              <div className="grid grid-cols-3 gap-1 px-1">
                {Array.from({ length: 9 }, (_, index) => (
                  <Skeleton
                    className="aspect-square rounded-none"
                    key={`loading-skeleton-${index}`}
                  />
                ))}
              </div>
            ) : error ? (
              <ErrorContent
                onRefresh={() => mutate()}
                className="pt-19 pb-20"
              />
            ) : posts === undefined ? null : posts.length === 0 ? (
              <div className={cn("pt-19 pb-20", "flex flex-col items-center")}>
                <NoContent
                  icon={
                    <ImageIcon className="size-14 m-1 text-muted-foreground" />
                  }
                  title="No media yet"
                  description={
                    isSelf
                      ? "When you share media, they will appear on your profile."
                      : "This user has not posted any media yet."
                  }
                />
                {isSelf ? (
                  <Link href={ROUTE.POST_CREATE}>
                    <Button variant="outline" size="sm" className="mt-5">
                      Upload media
                    </Button>
                  </Link>
                ) : null}
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
                          <Skeleton className="aspect-square rounded-none" />
                        );
                    } else if (hasNextPage)
                      content = (
                        <Skeleton className="aspect-square rounded-none" />
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
