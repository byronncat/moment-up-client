
import { Suspense } from "react";
import HomeProvider from "./_providers/Home";
import { MomentSkeleton } from "@/components/moment";
import { Feeds, Moments } from "./_components";
import { CoreApi } from "@/services";

export default async function HomePage() {
  const momentsRes = CoreApi.getMoments(0);

  return (
    <HomeProvider>
      <div className="relative">
        <Feeds />
      </div>
      <div className="size-full">
        <div className="max-w-[600px] size-full mx-auto">
          <Suspense fallback={<MomentSkeletons />}>
            <Moments initialRes={momentsRes} />
          </Suspense>
        </div>
      </div>
    </HomeProvider>
  );
}

function MomentSkeletons() {
  return (
    <div className="flex flex-col gap-4 pt-[160px]">
      <MomentSkeleton haveText={true} media="none" />
      <MomentSkeleton haveText={false} media="square" />
    </div>
  );
}
