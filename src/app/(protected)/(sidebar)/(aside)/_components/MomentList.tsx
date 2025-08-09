"use client";

import type { MomentInfo, PaginationInfo } from "api";
import { useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { useMomentStore, useMoment } from "@/components/providers/MomentStorage";
import { useAuth, useRefreshSWR } from "@/components/providers/Auth";
import { useSidebar } from "@/components/ui/sidebar";
import { INITIAL_PAGE } from "@/constants/serverConfig";
import {
  TOP_PADDING,
  BOTTOM_PADDING,
  ITEM_GAP,
  HEADER_HEIGHT,
} from "../_constants/spacing";

import { ErrorContent, NoContent } from "@/components/common";
import { MomentList } from "@/components/moment";
import { Camera } from "@/components/icons";

type MomentsProps = Readonly<{
  apiUrl: (page: number) => string;
  noContentConfig?: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  loadingSkeleton: React.ReactNode;
  className?: string;
}>;

export default function Moments({
  apiUrl,
  noContentConfig = {
    icon: <Camera className="size-16 text-muted-foreground" />,
    title: "No moments found",
    description: "Wait for someone to post a moment.",
  },
  loadingSkeleton,
  className,
}: MomentsProps) {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token } = useAuth();
  const { isMobile } = useSidebar();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationInfo<MomentInfo> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = apiUrl(pageIndex + 1);
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

  const { setMoments, setCurrentIndex, ...momentActions } = useMomentStore();
  const { like, bookmark, follow } = useMoment();

  const hasNextPage = data
    ? (data[data.length - 1]?.hasNextPage ?? false)
    : true;
  const allMoments = useMemo(() => {
    return data ? data.flatMap((page) => page?.items || []) : undefined;
  }, [data]);

  async function handleLoadNextPage() {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }

  function handleClick(index: number) {
    setCurrentIndex(index);
  }

  useEffect(() => {
    if (!error && allMoments) setMoments(allMoments);
  }, [allMoments, setMoments, error]);

  if (isLoading) return loadingSkeleton;
  if (error) return <ErrorContent onRefresh={mutate} className="pt-[121px]" />;
  if (!allMoments) return null;
  if (allMoments.length === 0)
    return (
      <NoContent
        icon={noContentConfig.icon}
        title={noContentConfig.title}
        description={noContentConfig.description}
        className="pt-[121px]"
      />
    );

  return (
    <div className={className}>
      <MomentList
        items={allMoments}
        hasNextPage={hasNextPage}
        isNextPageLoading={isValidating}
        loadNextPage={handleLoadNextPage}
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
          topPadding: TOP_PADDING + ITEM_GAP - (isMobile ? HEADER_HEIGHT : 0),
          bottomPadding: BOTTOM_PADDING,
        }}
      />
    </div>
  );
}
