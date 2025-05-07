"use client";

import { mockMoments } from "@/__mocks__";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
// import { MomentCell } from "@/components/moment";
import { Skeleton } from "@/components/ui/skeleton";

export default function MediaPage() {
  const [loaded, setLoaded] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("grid grid-cols-3", "gap-1", "px-1 sm:px-0")}>
      {loaded
        ? mockMoments.map((moment) => (
            // <MomentCell key={moment.id} data={moment} />
            <div key={moment.id}>{moment.id}</div>
          ))
        : Array(9)
            .fill(0)
            .map((_, i) => <Skeleton key={i} className="aspect-square" />)}
    </div>
  );
}
