"use client";

import type { MomentInfo, PaginationInfo } from "api";

import { useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { useMoment } from "@/components/providers/MomentData";
import { useAuth, useRefreshSWR } from "@/components/providers/Auth";
import { useHome } from "../_providers/Home";
import { ApiUrl } from "@/services";

import { cn } from "@/libraries/utils";
import { NoContent, ErrorContent } from "@/components/common";
import { MomentList, MomentSkeleton } from "@/components/moment";
import { Camera } from "@/components/icons";

const TOP_PADDING = 160;
const BOTTOM_PADDING = 121;
const INITIAL_PAGE = 1;

export default function Moments() {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token } = useAuth();
  const { hideFeeds, loadedSuccess } = useHome();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationInfo<MomentInfo> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = ApiUrl.moment.home(pageIndex + 1);
    return [url, token.accessToken];
  };

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite(
      getKey,
      ([url, accessToken]) =>
        swrFetcherWithRefresh<PaginationInfo<MomentInfo>>(url, accessToken),
      {
        initialSize: INITIAL_PAGE,
        revalidateFirstPage: false,
      }
    );

  const {
    moments,
    setMoments,
    setCurrentIndex,
    like,
    bookmark,
    report,
    share,
    follow,
    block,
  } = useMoment();

  const hasNextPage = data
    ? (data[data.length - 1]?.hasNextPage ?? false)
    : true;
  const isLoadingMore = !!(
    isValidating &&
    data &&
    typeof data[size - 1] !== "undefined"
  );
  const allMoments = useMemo(() => {
    return data ? data.flatMap((page) => page?.items || []) : [];
  }, [data]);

  async function loadNextPage() {
    if (hasNextPage && !isLoadingMore) await setSize(size + 1);
  }

  function handleClick(index: number) {
    setCurrentIndex(index);
  }

  useEffect(() => {
    if (!error) setMoments(allMoments);
  }, [allMoments, setMoments, error]);

  useEffect(() => {
    if (size === INITIAL_PAGE && !isLoading) loadedSuccess();
  }, [loadedSuccess, size, isLoading]);

  const spaceClassName = cn(
    hideFeeds ? "pt-[40px]" : "pt-[calc(145px+16px)]",
    "transition-all duration-200"
  );
  if (isLoading) return <MomentSkeletons className={spaceClassName} />;
  if (error)
    return (
      <ErrorContent onRefresh={() => mutate()} className={spaceClassName} />
    );

  if (!moments) return null;
  if (moments.length === 0)
    return (
      <NoContent
        icon={<Camera className="size-16 text-muted-foreground" />}
        title="No moments yet"
        description="When anyone you follow posts, they'll show up here."
        className={spaceClassName}
      />
    );

  return (
    <MomentList
      items={moments}
      hasNextPage={hasNextPage}
      isNextPageLoading={isLoadingMore}
      loadNextPage={loadNextPage}
      onItemClick={handleClick}
      actions={{
        like,
        bookmark,
        follow,
        share,
        block: (momentId) => block(momentId, { remove: true }),
        report,
      }}
      listOptions={{
        topPadding: TOP_PADDING,
        bottomPadding: BOTTOM_PADDING,
        listClassName: cn(
          "transform transition-transform duration-200",
          hideFeeds && "-translate-y-[121px]" // 120px = 160px (feed panel height) - 24px (hide button height) - 16px (gap)
        ),
      }}
    />
  );
}

function MomentSkeletons({ className }: Readonly<{ className: string }>) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <MomentSkeleton haveText={true} media="none" />
      <MomentSkeleton haveText={false} media="square" />
    </div>
  );
}
