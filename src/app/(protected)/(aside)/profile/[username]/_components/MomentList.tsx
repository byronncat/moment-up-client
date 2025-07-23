"use client";

import type { API, MomentInfo } from "api";
import { useState, useRef, use, useEffect, Suspense } from "react";
import { useMoment } from "@/components/providers/MomentData";
import { useProfile } from "../_providers/ProfileProvider";
import { UserApi } from "@/services";

import { cn } from "@/libraries/utils";
import ProfileZone from "./ProfileZone";
import { MomentList as List, MomentSkeleton } from "@/components/moment";

type MomentListProps = Readonly<{
  username: MomentInfo["user"]["username"];
  initialRes: API<{ items: MomentInfo[]; hasNextPage: boolean }>;
}>;

export default function SuspenseWrapper({
  username,
  initialRes,
}: MomentListProps) {
  const { profile } = useProfile();
  return (
    <Suspense
      fallback={
        <div>
          <ProfileZone data={profile} />
          <div
            className={cn(
              "flex flex-col gap-4",
              "max-w-[600px] size-full mx-auto",
              "pt-4"
            )}
          >
            <MomentSkeleton haveText media="none" />
            <MomentSkeleton media="horizontal" />
          </div>
        </div>
      }
    >
      <MomentList username={username} initialRes={initialRes} />
    </Suspense>
  );
}

function MomentList({ username, initialRes }: MomentListProps) {
  const momentsRes = use(initialRes);
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
  const { profile } = useProfile();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const pageRef = useRef(1);

  async function fetchMoments(page?: number) {
    const response = await UserApi.getMoments(
      "all",
      username,
      page ?? pageRef.current + 1
    );
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
    if (momentsRes.data) setMoments(momentsRes.data.items);
  }, [momentsRes.data, setMoments]);

  if (!momentsRes.success) {
    throw new Error("Failed to fetch moments");
  }

  return (
    <List
      items={moments ?? []}
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
        topChildren: <ProfileZone data={profile} />,
        topPadding: 442 + 16,
        bottomPadding: 121,
      }}
      itemOptions={{
        maxWidth: 600,
        className: "mx-auto max-w-[600px] w-full",
      }}
    />
  );
}
