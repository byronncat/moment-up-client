import { CoreApi } from "@/services";
import { MomentSkeleton } from "@/components/moment";

import { Suspense } from "react";
import { MomentList } from "../_components";
import { TOP_PADDING, ITEM_GAP } from "../_components/constants/spacing";

export default function MomentsPage() {
  const momentsRes = CoreApi.explore("moments", 0);

  return (
    <div className="max-w-[600px] size-full mx-auto">
      <Suspense fallback={<MomentsSkeleton />}>
        <MomentList initialRes={momentsRes} />
      </Suspense>
    </div>
  );
}

function MomentsSkeleton() {
  return (
    <div
      className="flex flex-col gap-4"
      style={{ paddingTop: TOP_PADDING + ITEM_GAP }}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <MomentSkeleton key={index} haveText media="square" />
      ))}
    </div>
  );
}
