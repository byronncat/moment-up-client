"use client";

import type { MomentInfo, PaginationInfo } from "api";
import { useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { useMomentStore } from "@/components/providers/MomentData";
import { useAuth, useRefreshSWR } from "@/components/providers/Auth";
import { useSidebar } from "@/components/ui/sidebar";
import { INITIAL_PAGE } from "@/constants/serverConfig";
import {
  TOP_PADDING,
  BOTTOM_PADDING,
  CELL_GAP,
  HEADER_HEIGHT,
} from "../_constants/spacing";

import { ErrorContent, NoContent } from "@/components/common";
import { MomentGrid as Grid } from "@/components/moment";
import { Image } from "@/components/icons";

type MomentGridProps = Readonly<{
  apiUrl: (page: number) => string;
  noContentConfig?: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  loadingSkeleton: React.ReactNode;
  className?: string;
}>;

export default function MomentGrid({
  apiUrl,
  noContentConfig = {
    // eslint-disable-next-line jsx-a11y/alt-text
    icon: <Image multiple className="size-16 text-muted-foreground" />,
    title: "No media found",
    description: "Wait for someone to post a media.",
  },
  loadingSkeleton,
  className,
}: MomentGridProps) {
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

  const { setMoments, setCurrentIndex } = useMomentStore();

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
      <Grid
        items={allMoments}
        hasNextPage={hasNextPage}
        isNextPageLoading={isValidating}
        loadNextPage={handleLoadNextPage}
        onItemClick={handleClick}
        listOptions={{
          topPadding: TOP_PADDING + CELL_GAP - (isMobile ? HEADER_HEIGHT : 0),
          bottomPadding: BOTTOM_PADDING,
        }}
      />
    </div>
  );
}
