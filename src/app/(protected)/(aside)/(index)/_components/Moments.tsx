"use client";

import type { API, DetailedMomentInfo } from "api";

import { useState, useRef, use, useEffect } from "react";
import { useMoment } from "@/components/providers/MomentData";
import { useHome } from "../_providers/Home";
import { CoreApi } from "@/services";

import { cn } from "@/libraries/utils";
import { NoContent, ErrorContent } from "@/components/common";
import { MomentList } from "@/components/moment";
import { Camera } from "@/components/icons";

// Container
const TOP_PADDING = 160;
const BOTTOM_PADDING = 121;

type MomentsProps = Readonly<{
  initialRes: API<{
    items: DetailedMomentInfo[];
    hasNextPage: boolean;
  }>;
}>;

export default function Moments({ initialRes }: MomentsProps) {
  const response = use(initialRes);
  const {
    moments,
    setMoments,
    setCurrentIndex,
    addMoments,
    like,
    bookmark,
    report,
    share,
    follow,
    block,
  } = useMoment();
  const [hasNextPage, setHasNextPage] = useState(
    response?.data?.hasNextPage ?? true
  );
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const { hideFeeds, loadedSuccess } = useHome();
  const pageRef = useRef(1);

  async function fetchMoments(page?: number) {
    const response = await CoreApi.getMoments(page ?? pageRef.current + 1);
    if (response.success) {
      addMoments(response.data?.items ?? []);
      setHasNextPage(response.data?.hasNextPage ?? false);
      pageRef.current = page ?? pageRef.current + 1;
    } else setHasNextPage(false);
    setIsNextPageLoading(false);
  }

  function handleClick(index: number) {
    setCurrentIndex(index);
  }

  useEffect(() => {
    if (response.data) setMoments(response.data.items);
    loadedSuccess();
  }, [response.data, setMoments, loadedSuccess]);

  if (response.success === false)
    return (
      <ErrorContent
        onRefresh={() => {
          setIsNextPageLoading(true);
          fetchMoments(0);
        }}
        className="pt-[144px]"
      />
    );

  if (!moments) return null;
  if (moments.length === 0)
    return (
      <NoContent
        icon={<Camera className="size-16 text-muted-foreground" />}
        title="No moments yet"
        description="When anyone you follow posts, they'll show up here."
        className="pt-[144px]"
      />
    );

  return (
    <MomentList
      items={moments}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={() => fetchMoments()}
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
          "transform transition-transform duration-300",
          hideFeeds && "-translate-y-[120px]" // 120px = 160px (feed panel height) - 24px (hide button height) - 16px (gap)
        ),
      }}
    />
  );
}
