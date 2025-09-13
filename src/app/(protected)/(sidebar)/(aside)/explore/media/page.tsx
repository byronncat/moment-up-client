"use client";

import { ApiUrl } from "@/services";
import { cn } from "@/libraries/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { MomentGrid } from "../../_components";
import { TOP_PADDING, CELL_GAP } from "../../_constants/spacing";

const EXPLORER_LIMIT = 50;
export default function MediaPage() {
  return (
    <MomentGrid
      apiUrl={(page: number) =>
        ApiUrl.post.explore("media", page, EXPLORER_LIMIT)
      }
      loadingSkeleton={<ExploreSkeleton />}
      className="size-full"
    />
  );
}

function ExploreSkeleton() {
  return (
    <div
      className={cn(
        "grid grid-cols-3",
        "gap-1 px-1 max-laptop:pt-[calc(45px+4px)]!" // Navigation bar height + 4px
      )}
      style={{ paddingTop: TOP_PADDING + CELL_GAP }}
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <Skeleton key={index} className="aspect-square rounded-none" />
      ))}
    </div>
  );
}
