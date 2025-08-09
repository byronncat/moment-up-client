"use client";

import type { MomentInfo, PaginationInfo } from "api";
import { useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { useMomentStore, useMoment } from "@/components/providers/MomentStorage";
import { useAuth, useRefreshSWR } from "@/components/providers/Auth";
import { useProfile } from "../_providers/ProfileProvider";
import { ApiUrl } from "@/services/api.constant";
import { INITIAL_PAGE } from "@/constants/serverConfig";
import { PROFILE_ZONE_HEIGHT } from "./spacing.constant";

import { MomentList as List, MomentSkeleton } from "@/components/moment";
import { NoContent, ErrorContent } from "@/components/common";
import ProfileZone from "./ProfileZone";
import ProfileWrapper from "./Wrapper";
import { Camera } from "@/components/icons";

type MomentListProps = Readonly<{
  filter?: "media" | "tagged";
}>;

export default function MomentList({ filter }: MomentListProps) {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token, user } = useAuth();
  const { profile } = useProfile();
  const isSelf = user?.username === profile?.username;

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationInfo<MomentInfo> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = ApiUrl.moment.user(profile.id, filter, pageIndex + 1);
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

  const { setMoments, setCurrentIndex, ...momentActions } = useMomentStore();
  const { like, bookmark, follow } = useMoment();

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
        <MomentSkeleton haveText media="none" />
        <MomentSkeleton media="horizontal" />
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
          icon={<Camera className="size-16 text-muted-foreground" />}
          title="No moments found"
          description="This user has not posted any moments yet."
          className="pt-[80px]"
        />
      </ProfileWrapper>
    );

  return (
    <List
      items={allMoments}
      hasNextPage={hasNextPage && error?.statusCode !== 403}
      isNextPageLoading={isValidating}
      loadNextPage={loadNextPage}
      onItemClick={handleClick}
      actions={{
        like,
        bookmark,
        follow,
        share: async (momentId: string) => {
          momentActions.share(momentId);
        },
        block: async (momentId: string) => {
          await momentActions.block(momentId, { remove: true });
        },
        report: async (momentId: string) => {
          await momentActions.report(momentId);
        },
      }}
      listOptions={{
        topChildren: <ProfileZone data={profile} />,
        topPadding: PROFILE_ZONE_HEIGHT(isSelf || !!profile.bio) + 16,
        bottomPadding: 121,
      }}
      itemOptions={{
        maxWidth: 600,
        className: "mx-auto max-w-[600px] w-full",
      }}
    />
  );
}
