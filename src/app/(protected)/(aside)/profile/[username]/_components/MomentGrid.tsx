"use client";

import type { MomentInfo, PaginationInfo } from "api";
import { useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { useMomentStore } from "@/components/providers/MomentData";
import { useAuth, useRefreshSWR } from "@/components/providers/Auth";
import { useProfile } from "../_providers/ProfileProvider";
import { ApiUrl } from "@/services/api.constant";
import { INITIAL_PAGE } from "@/constants/serverConfig";
import { PROFILE_ZONE_HEIGHT } from "./spacing.constant";

import ProfileZone from "./ProfileZone";
import { NoContent, ErrorContent } from "@/components/common";
import { MomentGrid as Grid } from "@/components/moment";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "@/components/icons";

export default function MomentGrid() {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token } = useAuth();
  const { profile } = useProfile();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationInfo<MomentInfo> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = ApiUrl.moment.user(profile.id, "media", pageIndex + 1);
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

  const { setMoments, setCurrentIndex } = useMomentStore();

  const hasNextPage = data
    ? (data[data.length - 1]?.hasNextPage ?? false)
    : true;
  const isLoadingMore = !!(
    isValidating &&
    data &&
    typeof data[size - 1] !== "undefined"
  );
  const allMoments = useMemo(() => {
    return data ? data.flatMap((page) => page?.items || []) : undefined;
  }, [data]);

  async function loadNextPage() {
    if (hasNextPage && !isLoadingMore) await setSize(size + 1);
  }

  function handleClick(index: number) {
    setCurrentIndex(index);
  }

  useEffect(() => {
    if (!error && allMoments) setMoments(allMoments);
  }, [allMoments, setMoments, error]);

  if (isLoading) {
    return (
      <div>
        <ProfileZone data={profile} />
        <div className="grid grid-cols-3 gap-1 px-1 pt-1">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton className="aspect-square rounded-none" key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error)
    return <ErrorContent onRefresh={() => mutate()} className="pt-[121px]" />;
  if (!allMoments) return null;
  if (allMoments.length === 0)
    return (
      <NoContent
        // eslint-disable-next-line jsx-a11y/alt-text
        icon={<Image className="size-16 text-muted-foreground" />}
        title="No media found"
        description="This user has not posted any media yet."
        className="pt-[121px]"
      />
    );

  return (
    <Grid
      items={allMoments}
      hasNextPage={hasNextPage}
      isNextPageLoading={isLoadingMore}
      loadNextPage={loadNextPage}
      onItemClick={handleClick}
      listOptions={{
        topChildren: <ProfileZone data={profile} />,
        topPadding: PROFILE_ZONE_HEIGHT + 4,
        bottomPadding: 16,
      }}
    />
  );
}
