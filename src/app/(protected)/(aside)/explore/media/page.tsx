import { CoreApi } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/libraries/utils";
import { Suspense } from "react";
import { MomentGrid } from "../_components";
import { TOP_PADDING, CELL_GAP } from "../_components/constants/spacing";

export default function MediaPage() {
  const mediaRes = CoreApi.explore("media", 0);

  return (
    <Suspense fallback={<MediaSkeleton />}>
      <MomentGrid initialRes={mediaRes} />
    </Suspense>
  );
}

function MediaSkeleton() {
  return (
    <div
      className={cn("grid grid-cols-3", "gap-1 px-1")}
      style={{ paddingTop: TOP_PADDING + CELL_GAP }}
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <Skeleton key={index} className="aspect-square rounded-none" />
      ))}
    </div>
  );
}
