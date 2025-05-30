import { CoreApi } from "@/services";
import { Suspense } from "react";
import { Moments } from "./_components";
import { MomentSkeleton } from "@/components/moment";

export default function HomePage() {
  const momentsRes = CoreApi.getMoments(1);
  return (
    <div className="size-full">
      {/* <Feeds className="mb-4" /> */}
      <Suspense fallback={<MomentSkeletons />}>
        <Moments initialRes={momentsRes} />
      </Suspense>
    </div>
  );
}

function MomentSkeletons() {
  return (
    <>
      <MomentSkeleton variant="horizontal" />
      <MomentSkeleton variant="square" />
    </>
  );
}
