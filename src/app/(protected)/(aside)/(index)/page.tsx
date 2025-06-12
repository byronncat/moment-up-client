import { CoreApi } from "@/services";

import { cn } from "@/libraries/utils";
import { Suspense } from "react";
import { Feeds, Moments } from "./_components";
import { MomentSkeleton } from "@/components/moment";
import { CreateFeedButton, FeedItemSkeleton } from "./_components/FeedItem";
import HomeProvider from "./_providers/Home";

export default function HomePage() {
  const feedsRes = CoreApi.getFeeds();
  const momentsRes = CoreApi.getMoments(1);
  return (
    <div className={cn("size-full", "border-x border-border")}>
      <HomeProvider>
        <div className="relative">
          <Suspense fallback={<FeedSkeletons />}>
            <Feeds initialRes={feedsRes} />
          </Suspense>
        </div>
        <div className="size-full">
          <div className="max-w-[600px] size-full mx-auto">
            <Suspense fallback={<MomentSkeletons />}>
              <Moments initialRes={momentsRes} />
            </Suspense>
          </div>
        </div>
      </HomeProvider>
    </div>
  );
}

function MomentSkeletons() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <MomentSkeleton variant="horizontal" />
      <MomentSkeleton variant="square" />
    </div>
  );
}

function FeedSkeletons() {
  return (
    <div className={cn("h-[144px]", "flex flex-col")}>
      <div className="flex grow">
        <div className={cn("w-8", "border-r border-border")} />
        <div className={cn("flex gap-3", "pt-4 pb-2 grow")}>
          <CreateFeedButton />
          <FeedItemSkeleton />
          <FeedItemSkeleton />
          <FeedItemSkeleton />
        </div>
        <div className={cn("w-8", "border-l border-border")} />
      </div>
      <div className={cn("h-6", "border-y border-border")} />
    </div>
  );
}
