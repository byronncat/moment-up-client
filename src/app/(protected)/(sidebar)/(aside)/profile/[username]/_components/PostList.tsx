"use client";

import type { FeedItemDto, PaginationDto } from "api";

import { useCallback, useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useAuth, useRefreshSWR } from "@/components/providers";
import {
  useMoment,
  useMomentStore,
} from "@/components/providers/MomentStorage";
import { useProfile } from "../_providers/ProfileProvider";
import { getPostHeight } from "@/helpers/ui";
import { ApiUrl } from "@/services/api.constant";
import { ROUTE } from "@/constants/route";
import { POST_CARD_LIST_GAP } from "@/constants/client";
import { INITIAL_PAGE } from "@/constants/server";

import Link from "next/link";
import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { FeedCard, PostSkeleton } from "@/components/post";
import { ErrorContent, NoContent } from "@/components/common";
import ProfileZone, { PROFILE_ZONE_HEIGHT } from "./ProfileZone";
import { Camera } from "@/components/icons";

type PostListProps = Readonly<{
  filter?: "media" | "tagged";
}>;

const ITEMS_EACH_PAGE = 20;

export default function PostList({ filter }: PostListProps) {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token, user } = useAuth();
  const { profile, isSelf } = useProfile();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationDto<FeedItemDto> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = ApiUrl.post.user(
      profile.id,
      filter,
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

  const { moments, setMoments, setCurrentIndex, ...momentActions } =
    useMomentStore();
  const { like, bookmark, follow } = useMoment();

  const hasNextPage = user && (data?.[data.length - 1].hasNextPage ?? true);

  const itemCount = moments
    ? moments.length === 0 || error // Profile + Content
      ? 2
      : 1 + moments.length + (hasNextPage && error?.statusCode !== 403 ? 1 : 0) // Profile + Posts + Loading
    : isLoading
      ? 2
      : 1; // Profile only

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    overscan: 3,
    gap: POST_CARD_LIST_GAP,
    paddingEnd: POST_CARD_LIST_GAP,
    estimateSize: (index) => {
      if (index === 0) return PROFILE_ZONE_HEIGHT;
      return getPostHeight(moments?.[index - 1]?.post, window.innerWidth);
    },
  });
  const virtualItems = virtualizer.getVirtualItems();

  const loadNextPage = useCallback(async () => {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }, [hasNextPage, isValidating, setSize, size]);

  function handleClick(index: number) {
    setCurrentIndex(index);
  }

  useEffect(() => {
    const allPosts = data?.flatMap((page) => page.items);
    if (!error && allPosts) setMoments(allPosts);
  }, [data, error, setMoments]);

  useEffect(() => {
    if (!moments) return;
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (
      lastItem.index - 1 >= moments.length - 1 &&
      hasNextPage &&
      !isValidating &&
      user
    )
      loadNextPage();
  }, [user, moments, virtualItems, hasNextPage, isValidating, loadNextPage]);

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
        const isLoaderRow =
          hasNextPage &&
          error?.statusCode !== 403 &&
          vItem.index === itemCount - 1;
        const dataIndex = vItem.index - 1;
        const post = moments?.[dataIndex];

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
              <div
                className={cn(
                  "max-w-[calc(600px+16px)] px-2 mx-auto",
                  "space-y-4"
                )}
              >
                <PostSkeleton haveText media="horizontal" className="w-full" />
                <PostSkeleton media="square" className="w-full" />
              </div>
            ) : error && error?.statusCode !== 403 ? (
              <ErrorContent
                onRefresh={() => mutate()}
                className="pt-16 pb-20"
              />
            ) : moments === undefined ? null : moments.length === 0 ? (
              <div className={cn("pt-16 pb-20", "flex flex-col items-center")}>
                <NoContent
                  icon={
                    <Camera
                      variant="regular"
                      className="size-16 text-muted-foreground"
                    />
                  }
                  title="No posts yet"
                  description={
                    isSelf
                      ? "When you share posts, they will appear on your profile."
                      : "This user has not posted any posts yet."
                  }
                />
                {isSelf ? (
                  <Link href={ROUTE.POST_CREATE}>
                    <Button variant="outline" size="sm" className="mt-5">
                      Create post
                    </Button>
                  </Link>
                ) : null}
              </div>
            ) : isLoaderRow ? (
              <div className="max-w-[calc(600px+16px)] px-2 mx-auto">
                <PostSkeleton haveText media="horizontal" className="w-full" />
              </div>
            ) : post ? (
              <div className="max-w-[calc(600px+16px)] px-2 mx-auto">
                <FeedCard
                  data={post}
                  actions={{ like, bookmark, follow, ...momentActions }}
                  onClick={() => handleClick(dataIndex)}
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
