import { CoreApi } from "@/services";

import { cn } from "@/libraries/utils";
import { Suspense } from "react";
import HomeProvider from "./_providers/Home";
import { Feeds, FeedSkeletons, Moments } from "./_components";
import { MomentSkeleton } from "@/components/moment";

export default function HomePage() {
  const feedsRes = CoreApi.getFeeds();
  const momentsRes = CoreApi.getMoments(1);
  return (
    <div
      className={cn(
        "size-full",
        "[@media(min-width:calc(640px+48px+1px))]:border-x border-border"
      )}
    >
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
