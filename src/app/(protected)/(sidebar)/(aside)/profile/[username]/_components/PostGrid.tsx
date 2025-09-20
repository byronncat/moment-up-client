"use client";

import type { MomentInfo, PaginationDto } from "api";
import { useCallback, useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useMomentStore } from "@/components/providers/MomentStorage";
import { useAuth, useRefreshSWR } from "@/components/providers/Auth";
import { useProfile } from "../_providers/ProfileProvider";
import { ApiUrl } from "@/services/api.constant";
import { INITIAL_PAGE } from "@/constants/server";

import ProfileZone from "./ProfileZone";
import { ErrorContent, NoContent } from "@/components/common";
import { MomentCell } from "@/components/moment";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon } from "@/components/icons";

const COLUMN_COUNT = 3;
const GAP = 4;

export default function MomentGrid() {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token } = useAuth();
  const { profile } = useProfile();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationDto<MomentInfo> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = ApiUrl.post.user(profile?.id ?? "", "media", pageIndex + 1);
    return [url, token.accessToken];
  };

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite(
      getKey,
      ([url, accessToken]) =>
        swrFetcherWithRefresh<PaginationDto<MomentInfo>>(url, accessToken),
      {
        initialSize: INITIAL_PAGE,
        revalidateFirstPage: false,
        errorRetryCount: 0,
      }
    );

  const { setMoments, setCurrentIndex } = useMomentStore();

  const hasNextPage = data
    ? (data[data.length - 1]?.hasNextPage ?? false)
    : true;
  const allMoments = useMemo(() => {
    return data ? data.flatMap((page) => page?.items || []) : undefined;
  }, [data]);

  // Calculate grid layout
  const remainder = allMoments ? allMoments.length % COLUMN_COUNT : 0;
  const dataRowCount = allMoments
    ? Math.ceil(allMoments.length / COLUMN_COUNT)
    : 0;
  const needsSkeletonRow = hasNextPage && remainder === 0;
  const skeletonRowCount = needsSkeletonRow ? 1 : 0;
  const itemCount = allMoments ? 1 + dataRowCount + skeletonRowCount : 1; // Profile + Data rows + Skeleton row

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    overscan: 3,
    gap: GAP,
    estimateSize: () => 150, // Approximate row height for grid
    measureElement: (element) => element.getBoundingClientRect().height,
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

    // Check if we need to load more when approaching the last row
    if (
      lastItem.index >= dataRowCount - 1 &&
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
    dataRowCount,
  ]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1 px-1 pt-1">
        {Array.from({ length: 9 }, (_, index) => (
          <Skeleton
            className="aspect-square rounded-none"
            key={`loading-skeleton-${index}`}
          />
        ))}
      </div>
    );
  }

  if (error && error.statusCode !== 403)
    return <ErrorContent onRefresh={() => mutate()} className="pt-[80px]" />;
  if (!allMoments) return null;
  if (allMoments.length === 0)
    return (
      <NoContent
        icon={<ImageIcon className="size-16 text-muted-foreground" />}
        title="No media found"
        description="This user has not posted any media yet."
        className="pt-[80px]"
      />
    );

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
        const startIndex = rowIndex * COLUMN_COUNT;

        return (
          <div
            key={vItem.key}
            data-index={vItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${vItem.start}px)`,
            }}
          >
            {isProfileRow ? (
              <div className="pb-1">
                <ProfileZone />
              </div>
            ) : (
              <div className="flex justify-around gap-1 px-1">
                {Array.from({ length: COLUMN_COUNT }, (_, columnIndex) => {
                  const dataIndex = startIndex + columnIndex;
                  let content = null;

                  if (rowIndex < dataRowCount) {
                    if (allMoments && dataIndex < allMoments.length) {
                      content = (
                        <MomentCell
                          data={allMoments[dataIndex]}
                          onClick={() => handleClick(dataIndex)}
                        />
                      );
                    } else if (
                      hasNextPage &&
                      remainder > 0 &&
                      rowIndex === dataRowCount - 1
                    ) {
                      content = (
                        <Skeleton className="aspect-square rounded-none" />
                      );
                    }
                  } else if (hasNextPage) {
                    content = (
                      <Skeleton className="aspect-square rounded-none" />
                    );
                  }

                  return (
                    <div
                      key={`col-${vItem.index}-${columnIndex}`}
                      className="flex-1"
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
