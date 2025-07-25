// import { UserApi } from "@/services";

import { Suspense } from "react";
// import { MomentList } from "../../_components";
import { MomentSkeleton } from "@/components/moment";
import { TOP_PADDING, ITEM_GAP } from "../../_constants/spacing";

export default function LikePage() {
  // const momentsRes = UserApi.getMoments("likes", "username", 0);

  return (
    <div className="max-w-[600px] size-full mx-auto">
      <Suspense fallback={<MomentsSkeleton />}>
        {/* <MomentList initialRes={momentsRes} /> */}
      </Suspense>
    </div>
  );
}

function MomentsSkeleton() {
  return (
    <div
      className="flex flex-col gap-4 max-laptop:pt-[61px]!"
      style={{ paddingTop: TOP_PADDING + ITEM_GAP }}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <MomentSkeleton key={index} haveText media="square" />
      ))}
    </div>
  );
}
