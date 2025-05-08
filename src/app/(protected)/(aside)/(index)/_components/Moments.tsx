"use client";

import type { DetailedMoment } from "api";

import { useEffect, useState, useRef, useCallback } from "react";
import { CoreApi } from "@/services";
import { MomentCard, MomentSkeleton } from "@/components/moment";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounceCallback } from "usehooks-ts";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components";

export default function Moments() {
  const [moments, setMoments] = useState<DetailedMoment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const page = useRef(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchMoments = useDebounceCallback(async () => {
    const res = await CoreApi.getMoments(page.current);
    if (res.success) {
      const newMoments = res.data ?? [];
      setMoments((prev) => (prev ? [...prev, ...newMoments] : newMoments));
      if (newMoments.length === 0) setHasMore(false);
      else page.current += 1;
    }
  }, 1000);

  useEffect(() => {
    async function initFetch() {
      await fetchMoments();
      setLoading(false);
    }
    initFetch();
  }, [fetchMoments]);

  // useEffect(() => {
  //   if (loading) return;

  //   observerRef.current = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasMore) fetchMoments();
  //     },
  //     { threshold: 0.1 }
  //   );

  //   if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);

  //   return () => {
  //     if (observerRef.current) observerRef.current.disconnect();
  //   };
  // }, [loading, hasMore, fetchMoments]);

  // if (loading && !moments) return <MomentSkeleton count={3} />;
  return (
    <div className={cn("flex flex-col gap-4", "grow")}>
      <MomentSkeleton variant="horizontal" />
      {moments?.map((moment) => <MomentCard key={moment.id} data={moment} />)}
      {/* {hasMore && <div ref={loadMoreRef}>{loading && <Loader />}</div>}
       */}
      {!hasMore && moments?.length === 0 && <NoMoments />}
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center py-4">
      <Loader2 className="size-4 animate-spin" />
    </div>
  );
}

function NoMoments() {
  return (
    <div className={cn("flex flex-col items-center justify-center", "h-full")}>
      <Logo className="size-12" />
      <p className={cn("text-lg font-medium", "mt-4")}>No moments yet</p>
      <p className={cn("text-sm text-muted-foreground", "mt-1")}>
        When anyone you follow posts, they&apos;ll show up here.
      </p>
    </div>
  );
}
