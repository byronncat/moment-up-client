"use client";

import { ApiUrl } from "@/services";
import { MomentSkeleton } from "@/components/moment";
import { MomentList } from "../../_components";
import { TOP_PADDING, ITEM_GAP } from "../../_constants/spacing";

export default function MomentPage() {
  return (
    <div className="max-w-[600px] size-full mx-auto">
      <MomentList
        apiUrl={(page: number) => ApiUrl.post.explore("post", page)}
        loadingSkeleton={<ExploreSkeleton />}
        className="size-full"
      />
    </div>
  );
}

function ExploreSkeleton() {
  return (
    <div className="max-w-[600px] size-full mx-auto">
      <div
        className="flex flex-col gap-4 max-laptop:pt-[calc(45px+16px)]!" // Navigation bar height + 16px
        style={{ paddingTop: TOP_PADDING + ITEM_GAP }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <MomentSkeleton key={index} haveText media="square" />
        ))}
      </div>
    </div>
  );
}
