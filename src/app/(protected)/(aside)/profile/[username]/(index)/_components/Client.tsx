"use client";

import type { API, DetailedMomentInfo, UserProfileInfo } from "api";
import { useState, useRef, use, useEffect, Suspense } from "react";
import { useMoment } from "@/components/providers/MomentData";
import { UserApi } from "@/services";

import { cn } from "@/libraries/utils";
import { ProfileZone, MomentList } from "../../_components";
import { MomentSkeleton } from "@/components/moment";

type ProfileMomentsProps = Readonly<{
  username: DetailedMomentInfo["user"]["username"];
  profile: UserProfileInfo;
  initialRes: Promise<
    API<{ items: DetailedMomentInfo[]; hasNextPage: boolean }>
  >;
}>;

export default function SuspenseWrapper({
  username,
  profile,
  initialRes,
}: ProfileMomentsProps) {
  return (
    <Suspense
      fallback={
        <div>
          <ProfileZone data={profile} />
          <div className={cn("flex flex-col gap-4", "max-w-[600px] size-full mx-auto", "pt-4")}>
            <MomentSkeleton haveText media="none"/>
            <MomentSkeleton media="horizontal"/>
          </div>
        </div>
      }
    >
      <ProfileMomentsPage
        username={username}
        profile={profile}
        initialRes={initialRes}
      />
    </Suspense>
  );
}

function ProfileMomentsPage({
  username,
  profile,
  initialRes,
}: ProfileMomentsProps) {
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
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const pageRef = useRef(1);

  async function fetchMoments(page?: number) {
    const response = await UserApi.getMoments(
      "moments",
      username,
      page ?? pageRef.current + 1
    );
    if (response.success) {
      addMoments(response.data?.items ?? []);
      setHasNextPage(response.data?.hasNextPage ?? false);
      pageRef.current = page ?? pageRef.current + 1;
    } else {
      setHasNextPage(false);
    }
    setHasNextPage(false);
    setIsNextPageLoading(false);
  }

  function handleClick(index: number) {
    setCurrentIndex(index);
  }

  // if (response.success === false)
  //   return (
  //     <ErrorContent
  //       onRefresh={() => {
  //         setIsNextPageLoading(true);
  //         fetchMoments(0);
  //       }}
  //       className="pt-[144px]"
  //     />
  //   );

  useEffect(() => {
    if (momentsRes.data) setMoments(momentsRes.data.items);
  }, [momentsRes.data, setMoments]);

  // if (!moments || moments.length === 0) {
  //   return (
  //     <div className={cn("flex flex-col gap-4", "px-3 sm:px-0")}>
  //       <div className="mt-32">
  //         <NoContent
  //           icon={<Camera className="size-16 text-muted-foreground" />}
  //           title="No moments yet"
  //           description="When this user posts moments, they'll show up here."
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <MomentList
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
      styles={{
        topChildren: <ProfileZone data={profile} />,
        topPadding: 446 + 16,
        bottomPadding: 121,
      }}
      itemOptions={{
        maxWidth: 600,
      }}
    />
  );
}
