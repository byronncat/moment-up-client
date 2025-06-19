"use client";

import type { API, DetailedMomentInfo } from "api";

import { useState, useRef, use, useEffect } from "react";
import { useMoment } from "@/components/providers/MomentData";
import { CoreApi } from "@/services";

import { NoContent, ErrorContent } from "@/components";
import MomentList from "./List";
import { Camera } from "lucide-react";

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

  async function fetchMoments(page?: number) {
    const res = await CoreApi.getMoments(page ?? pageRef.current + 1);
    if (res.success) {
      addMoments(res.data?.items ?? []);
      setHasNextPage(res.data?.hasNextPage ?? false);
      pageRef.current = page ?? pageRef.current + 1;
    }
    setIsNextPageLoading(false);
  }

  const resetFnRef = useRef<(() => void) | null>(null);
  async function handleBlock(momentId: string) {
    await block(momentId, () => {
      if (resetFnRef.current) resetFnRef.current();
      else console.error("resetFnRef is not set");
    });
  }

  function handleClick(index: number) {
    setCurrentIndex(index);
  }

  useEffect(() => {
    if (response?.data?.items) setMoments(response.data.items);
  }, [response?.data?.items, setMoments]);

  if (response?.success === false)
    return (
      <ErrorContent
        onRefresh={() => {
          setIsNextPageLoading(true);
          fetchMoments(1);
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
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      items={moments}
      loadNextPage={() => fetchMoments()}
      onItemClick={handleClick}
      actions={{
        like,
        bookmark,
        follow,
        share,
        block: handleBlock,
        report,
        resetList: (resetFn) => {
          resetFnRef.current = resetFn;
        },
      }}
    />
  );
}
