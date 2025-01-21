"use client";
import { mockMoments } from "@/__mocks__";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { MomentCell } from "@/components/moment";

export default function ExplorePage() {
  const [loaded] = useState(true);

  return (
    <div className={cn("size-full max-w-5xl mx-auto", "px-3 pt-5 pb-10")}>
      <div className={cn("grid grid-cols-3", "gap-1")}>
        {loaded
          ? mockMoments.map((moment) => (
              <MomentCell key={moment.id} data={moment} />
            ))
          : new Array(9)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="aspect-square" />)}
      </div>
    </div>
  );
}
