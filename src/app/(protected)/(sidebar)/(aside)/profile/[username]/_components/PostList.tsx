"use client";

import type { FeedItemDto, PaginationDto } from "api";

import { useCallback, useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import {
  useMoment,
  useMomentStore,
} from "@/components/providers/MomentStorage";
import { useAuth, useRefreshSWR } from "@/components/providers/Auth";
import { useProfile } from "../_providers/ProfileProvider";
import { ApiUrl } from "@/services/api.constant";
import { INITIAL_PAGE } from "@/constants/server";
import { getItemSize } from "@/helpers/ui";
import { POST_CARD_LIST_GAP } from "@/constants/client";

import { MomentCard, MomentSkeleton } from "@/components/moment";
import { ErrorContent, NoContent } from "@/components/common";
import ProfileZone from "./ProfileZone";
import { Camera } from "@/components/icons";

type MomentListProps = Readonly<{
  filter?: "media" | "tagged";
}>;

export default function MomentList({ filter }: MomentListProps) {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token } = useAuth();
  const { profile } = useProfile();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationDto<FeedItemDto> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = ApiUrl.post.user(profile?.id ?? "", filter, pageIndex + 1);
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

  const { setMoments, setCurrentIndex, ...momentActions } = useMomentStore();
  const { like, bookmark, follow } = useMoment();

  const hasNextPage = data
    ? (data[data.length - 1]?.hasNextPage ?? false)
    : true;

  const allMoments = useMemo(() => {
    return data ? data.flatMap((page) => page?.items || []) : undefined;
  }, [data]);

  const itemCount = allMoments
    ? 1 + allMoments.length + (hasNextPage && error?.statusCode !== 403 ? 1 : 0)
    : 1; // Profile + Posts + Loading

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    overscan: 3,
    gap: POST_CARD_LIST_GAP,
    estimateSize: (index) =>
      getItemSize(
        index,
        allMoments?.[index - 1]?.post,
        600,
        600 + POST_CARD_LIST_GAP
      ),
  });
  const virtualItems = virtualizer.getVirtualItems();

  const loadNextPage = useCallback(async () => {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }, [hasNextPage, isValidating, setSize, size]);

  function handleClick(index: number) {
    setCurrentIndex(index);
  }

  useEffect(() => {
    if (!error && allMoments) setMoments(allMoments);
  }, [allMoments, setMoments, error]);

  useEffect(() => {
    if (!allMoments) return;
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (
      lastItem.index - 1 >= allMoments.length - 1 &&
      hasNextPage &&
      error?.statusCode !== 403 &&
      !isValidating
    )
      loadNextPage();
  }, [
    allMoments,
    virtualItems,
    hasNextPage,
    isValidating,
    error?.statusCode,
    loadNextPage,
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
        const isProfileRow = vItem.index === 0;
        const isLoaderRow =
          hasNextPage &&
          error?.statusCode !== 403 &&
          vItem.index === itemCount - 1;
        const dataIndex = vItem.index - 1;
        const moment = allMoments?.[dataIndex];

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
              <>
                <MomentSkeleton
                  haveText
                  media="horizontal"
                  className="max-w-[600px] mx-auto mb-4"
                />
                <MomentSkeleton
                  media="square"
                  className="max-w-[600px] mx-auto"
                />
              </>
            ) : error ? (
              <ErrorContent onRefresh={() => mutate()} className="pt-24" />
            ) : !allMoments ? null : allMoments.length === 0 ? (
              <NoContent
                icon={<Camera className="size-16 text-muted-foreground" />}
                title="No moments yet"
                description="This user has not posted any moments yet."
                className="pt-24"
              />
            ) : isLoaderRow ? (
              <MomentSkeleton
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
