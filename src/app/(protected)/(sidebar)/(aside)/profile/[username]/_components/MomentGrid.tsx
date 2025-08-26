"use client";

import type { MomentInfo, PaginationInfo } from "api";
import { useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { useMomentStore } from "@/components/providers/MomentStorage";
import { useAuth, useRefreshSWR } from "@/components/providers/Auth";
import { useProfile } from "../_providers/ProfileProvider";
import { ApiUrl } from "@/services/api.constant";
import { INITIAL_PAGE } from "@/constants/serverConfig";
import { PROFILE_ZONE_HEIGHT } from "./spacing.constant";

import ProfileZone from "./ProfileZone";
import { NoContent, ErrorContent } from "@/components/common";
import { MomentGrid as Grid } from "@/components/moment";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon } from "@/components/icons";
import ProfileWrapper from "./Wrapper";

export default function MomentGrid() {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token, user } = useAuth();
  const { profile } = useProfile();
  const isSelf = user?.username === profile?.username;

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

  async function loadNextPage() {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }

  function handleClick(index: number) {
    setCurrentIndex(index);
  }

  useEffect(() => {
    if (!error && allMoments) setMoments(allMoments);
  }, [allMoments, setMoments, error]);

  if (isLoading) {
    return (
      <ProfileWrapper data={profile}>
        <div className="grid grid-cols-3 gap-1 px-1 pt-1">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton className="aspect-square rounded-none" key={index} />
          ))}
        </div>
      </ProfileWrapper>
    );
  }

  if (error && error.statusCode !== 403)
    return (
      <ProfileWrapper data={profile}>
        <ErrorContent onRefresh={() => mutate()} className="pt-[80px]" />
      </ProfileWrapper>
    );
  if (!allMoments) return null;
  if (allMoments.length === 0)
    return (
      <ProfileWrapper data={profile}>
        <NoContent
          icon={<ImageIcon className="size-16 text-muted-foreground" />}
          title="No media found"
          description="This user has not posted any media yet."
          className="pt-[80px]"
        />
      </ProfileWrapper>
    );

  return (
    <Grid
      items={allMoments}
      hasNextPage={hasNextPage && error?.statusCode !== 403}
      isNextPageLoading={isValidating}
      loadNextPage={loadNextPage}
      onItemClick={handleClick}
      listOptions={{
        topChildren: <ProfileZone data={profile} />,
        topPadding: PROFILE_ZONE_HEIGHT(isSelf || !!profile.bio) + 4,
        bottomPadding: 16,
      }}
    />
  );
}
