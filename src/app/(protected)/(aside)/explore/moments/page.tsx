import { CoreApi } from "@/services";
import { MomentSkeleton } from "@/components/moment";

import { Suspense } from "react";
import { Moments } from "./_components";

export default function MomentsPage() {
  const momentsRes = CoreApi.explore("moments", 0);

  return (
    <div className="max-w-[600px] size-full mx-auto">
      <Suspense fallback={<MomentsSkeleton />}>
        <Moments initialRes={momentsRes} />
      </Suspense>
    </div>
  );
}

function MomentsSkeleton() {
  return (
    <div className="flex flex-col gap-4 pt-[calc(49px+16px)]">
      {Array.from({ length: 3 }).map((_, index) => (
        <MomentSkeleton key={index} haveText media="square" />
      ))}
    </div>
  );
}
