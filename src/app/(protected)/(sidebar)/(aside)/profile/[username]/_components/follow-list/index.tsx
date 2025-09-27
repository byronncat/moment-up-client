"use client";

import type { PaginationDto, UserSummaryDto } from "api";

import { useCallback, useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useAuth, useRefreshApi, useRefreshSWR } from "@/components/providers";
import { useProfile } from "../../_providers/ProfileProvider";
import { ApiUrl } from "@/services/api.constant";
import { INITIAL_PAGE } from "@/constants/server";

import { ErrorContent, NoContent } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";
import UserItem from "./UserItem";
import { User } from "@/components/icons";
import { UserApi } from "@/services";
import { toast } from "sonner";

type FollowListProps = Readonly<{
  type: "followers" | "following";
}>;

interface FollowResponse extends PaginationDto<UserSummaryDto> {
  followers?: UserSummaryDto[];
  following?: UserSummaryDto[];
}

export default function FollowList({ type }: FollowListProps) {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token } = useAuth();
  const { profile } = useProfile();

  const getKey = (
    pageIndex: number,
    previousPageData: FollowResponse | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url =
      type === "followers"
        ? ApiUrl.user.getFollowers(profile.id, pageIndex + 1)
        : ApiUrl.user.getFollowing(profile.id, pageIndex + 1);

    return [url, token.accessToken];
  };

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite(
      getKey,
      ([url, accessToken]) =>
        swrFetcherWithRefresh<FollowResponse>(url, accessToken),
      {
        initialSize: INITIAL_PAGE,
        revalidateFirstPage: false,
        errorRetryCount: 0,
      }
    );

  const hasNextPage = data?.[data.length - 1].hasNextPage ?? true;
  
  const allUsers = useMemo(() => {
    return data?.flatMap((page) => page.items);
  }, [data]);

  const itemCount = allUsers
    ? allUsers.length === 0 || error // Content
      ? 1
      : allUsers.length + (hasNextPage ? 1 : 0) // Users + Loading
    : isLoading
      ? 1 // Loading
      : 0;

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    overscan: 3,
    estimateSize: () => 120, // Approximate height for user card
    measureElement: (element) => element.getBoundingClientRect().height,
  });
  const virtualItems = virtualizer.getVirtualItems();

  const loadNextPage = useCallback(async () => {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }, [hasNextPage, isValidating, setSize, size]);

  useEffect(() => {
    if (!allUsers) return;
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (
      lastItem.index - 1 >= allUsers.length - 1 &&
      hasNextPage &&
      !isValidating
    )
      loadNextPage();
  }, [allUsers, virtualItems, hasNextPage, isValidating, loadNextPage]);

  const follow = useRefreshApi(UserApi.follow);
  async function handleFollow(userId: string, shouldFollow: boolean) {
    if (isLoading) return;

    const prev = data;
    const userPageIndex = data?.findIndex((page) => {
      const users = type === "followers" ? page.followers : page.following;
      return users?.some((user) => user.id === userId);
    });

    if (userPageIndex !== undefined && userPageIndex !== -1) {
      mutate(
        (currentData) => {
          if (!currentData) return currentData;

          return currentData.map((page, pageIndex) => {
            if (pageIndex !== userPageIndex) return page;

            const updatedPage = { ...page };
            const users =
              type === "followers"
                ? updatedPage.followers
                : updatedPage.following;

            if (users) {
              updatedPage[type === "followers" ? "followers" : "following"] =
                users.map((user) =>
                  user.id === userId
                    ? { ...user, isFollowing: shouldFollow }
                    : user
                );
            }

            return updatedPage;
          });
        },
        { revalidate: false }
      );
    }

    const { success, message } = await follow({
      targetId: userId,
      shouldFollow,
    });

    if (!success) {
      mutate(prev, { revalidate: false });
      toast.error(message || "Failed to follow/unfollow user");
    }
  }

  return (
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: "relative",
        width: "100%",
      }}
    >
      {virtualItems.map((vItem) => {
        const isLoaderRow = hasNextPage && vItem.index === itemCount - 1;
        const user = allUsers?.[vItem.index];

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
              Array.from({ length: 3 }).map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <UserItemSkeleton key={index} />
              ))
            ) : error ? (
              <ErrorContent
                onRefresh={() => mutate()}
                className="pt-16 pb-20"
              />
            ) : allUsers === undefined ? null : allUsers.length === 0 ? (
              <NoContent
                icon={
                  <User
                    type="solid"
                    className="size-12 text-muted-foreground"
                  />
                }
                title={`No ${type} yet`}
                description={
                  type === "followers"
                    ? "When people follow this user, they will appear here."
                    : "When this user follows people, they will appear here."
                }
                className="pt-16 pb-20"
              />
            ) : isLoaderRow ? (
              <UserItemSkeleton />
            ) : user ? (
              <UserItem
                data={user}
                onFollow={() => handleFollow(user.id, !user.isFollowing)}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function UserItemSkeleton() {
  return (
    <div className="px-4 py-3">
      <div className="flex gap-2.5">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 my-1 w-[200px]" />
          <Skeleton className="h-3 my-1 w-[150px]" />
          <Skeleton className="h-3 my-1 w-3/4" />
          <Skeleton className="h-3 my-1 w-3/5" />
        </div>
      </div>
    </div>
  );
}
