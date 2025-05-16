"use client";

import type { DetailedMoment } from "api";

import { useEffect, useState, useRef, useCallback } from "react";
import { CoreApi } from "@/services";
import { useInfiniteScroll } from "@/hooks";

import { cn } from "@/libraries/utils";
import NoMoments from "./NoMoments";
import MomentError from "./MomentError";
import NoMoreMoments from "./NoMoreMoments";
import { MomentCard, MomentSkeleton } from "@/components/moment";
import { Loader2 } from "lucide-react";

export default function Moments() {
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isInitialLoading = useRef(false);

  const {
    items: moments,
    isLoading: isLoadingMore,
    hasMore,
    loaderRef,
    loadMore,
    reset,
  } = useInfiniteScroll<DetailedMoment>();

  const fetchMomentsPage = useCallback(async (page: number) => {
    const res = await CoreApi.getMoments(page);
    if (res.success) {
      return res.data ?? [];
    }
    throw new Error("Failed to fetch moments");
  }, []);

  const fetchInitialMoments = useCallback(async () => {
    if (isInitialLoading.current) return;
    isInitialLoading.current = true;
    setError(null);

    try {
      await loadMore(fetchMomentsPage);
      setLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      isInitialLoading.current = false;
    }
  }, [loadMore, fetchMomentsPage]);

  async function handleRefresh() {
    setLoaded(false);
    reset();
    await fetchInitialMoments();
  }

  useEffect(() => {
    fetchInitialMoments();
  }, [fetchInitialMoments]);

  let content = null;
  if (!isLoaded) {
    content = <MomentSkeletons />;
  } else if (error) {
    content = <MomentError onRefresh={handleRefresh} />;
  } else if (moments) {
    if (moments.length > 0) {
      const footer = hasMore ? (
        isLoadingMore && (
          <div
            className={cn("w-full py-12", "flex justify-center items-center")}
          >
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        )
      ) : (
        <NoMoreMoments />
      );

      content = (
        <>
          {moments.map((moment) => (
            <MomentCard key={moment.id} data={moment} />
          ))}
          {footer}
          <div ref={loaderRef} />
        </>
      );
    } else {
      content = <NoMoments />;
    }
  }

  return <Wrapper>{content}</Wrapper>;
}

function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={cn("flex flex-col gap-4", "grow")}>{children}</div>;
}

function MomentSkeletons() {
  return (
    <>
      <MomentSkeleton variant="horizontal" />
      <MomentSkeleton variant="square" />
    </>
  );
}
