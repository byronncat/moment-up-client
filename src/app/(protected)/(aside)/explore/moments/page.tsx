"use client";
import { mockMoments } from "@/__mocks__";

import { useState, useEffect } from "react";
import { cn } from "@/libraries/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { MomentCard } from "@/components/moment";

export default function MomentsPage() {
  const [loaded, setLoaded] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("flex flex-col gap-4", "px-3 sm:px-0")}>
      {loaded
        ? mockMoments.map((moment) => (
            <MomentCard key={moment.id} data={moment} />
          ))
        : Array(9)
            .fill(0)
            .map((_, i) => <Skeleton key={i} className="aspect-square" />)}
    </div>
  );
}
