"use client";

import type { API, MomentInfo } from "api";
import { useState, useRef, use, useEffect, Suspense } from "react";
import { useMoment } from "@/components/providers/MomentData";
import { useProfile } from "../_providers/ProfileProvider";
import { UserApi } from "@/services";

import ProfileZone from "./ProfileZone";
import { MomentGrid as Grid } from "@/components/moment";
import { Skeleton } from "@/components/ui/skeleton";

type MomentGridProps = Readonly<{
  username: MomentInfo["user"]["username"];
  initialRes: API<{ items: MomentInfo[]; hasNextPage: boolean }>;
}>;

export default function SuspenseWrapper({
  username,
  initialRes,
}: MomentGridProps) {
  const { profile } = useProfile();
  return (
    <Suspense
      fallback={
        <div>
          <ProfileZone data={profile} />
          <div className="grid grid-cols-3 gap-1 px-1 pt-1">
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton className="aspect-square rounded-none" key={index} />
            ))}
          </div>
        </div>
      }
    >
      <MomentGrid username={username} initialRes={initialRes} />
    </Suspense>
  );
}

function MomentGrid({ username, initialRes }: MomentGridProps) {
  const momentsRes = use(initialRes);
  const { moments, setMoments, setCurrentIndex, addMoments } = useMoment();
  const { profile } = useProfile();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const pageRef = useRef(1);

  async function fetchMoments(page?: number) {
    const response = await UserApi.getMoments(
      "media",
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

  return (
    <Grid
      items={moments ?? []}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={() => fetchMoments()}
      onItemClick={handleClick}
      listOptions={{
        topChildren: <ProfileZone data={profile} />,
        topPadding: 442 + 4,
        bottomPadding: 16,
      }}
    />
  );
}
