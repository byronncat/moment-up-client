"use client";

import type { API, DetailedMomentInfo } from "api";
import { use, useEffect, useState, useRef } from "react";
import { useMoment } from "@/components/providers";
import { CoreApi } from "@/services";

import { ErrorContent, NoContent } from "@/components";
import MomentList from "../../../(index)/_components/moments/List";
import { Camera } from "lucide-react";

const TOP_PADDING = 49 + 16; // 49px (header height) + 16px (gap)
const BOTTOM_PADDING = 36; // 36px (footer height)

type MomentsProps = Readonly<{
  initialRes: Promise<
    API<{
      items: DetailedMomentInfo[];
      hasNextPage: boolean;
    }>
  >;
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
  const pageRef = useRef(1);
  const resetFnRef = useRef<(() => void) | null>(null);

  async function fetchMoments(page?: number) {
    const response = await CoreApi.explore(
      "moments",
      page ?? pageRef.current + 1
    );
    if (response.success) {
      addMoments(response.data?.items ?? []);
      setHasNextPage(response.data?.hasNextPage ?? false);
      pageRef.current = pageRef.current + 1;
    } else setHasNextPage(false);
    setIsNextPageLoading(false);
  }

  function handleClick(index: number) {
    setCurrentIndex(index);
  }

  useEffect(() => {
    if (response.data) setMoments(response.data.items);
  }, [response.success, response.data, setMoments]);

  if (!response.success) return <ErrorContent onRefresh={() => {}} />;
  if (!moments) return null;
  if (moments.length === 0)
    return (
      <NoContent
        icon={<Camera className="size-16 text-muted-foreground" />}
        title="No moments found"
        description="Wait for someone to post a moment."
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
        resetList: (resetFn: () => void) => {
          resetFnRef.current = resetFn;
        },
      }}
      styles={{
        topPadding: TOP_PADDING,
        bottomPadding: BOTTOM_PADDING,
      }}
    />
  );
}
