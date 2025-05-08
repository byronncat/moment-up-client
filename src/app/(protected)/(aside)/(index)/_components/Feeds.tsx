"use client";

import type { FeedNotification } from "api";

import { useEffect, useRef, useState, useCallback } from "react";
import { CoreApi } from "@/services";
import throttle from "@/helpers/throttle";

import { cn } from "@/libraries/utils";
import FeedItem, { FeedItemSkeleton, CreateFeedButton } from "./FeedItem";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "@/components/icons";

type Direction = "left" | "right";
const ITEMS_PER_VIEW = 3;
const ITEM_WIDTH = 88; // size-18 (72px) + gap (16px)
const ROUNDING_ERROR = 1;
const SCROLL_DELAY = 150;

export default function Feeds({
  className,
}: Readonly<{
  className?: string;
}>) {
  const [feeds, setFeeds] = useState<FeedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchInitialFeeds() {
      const res = await CoreApi.getFeeds();
      if (res.success) setFeeds(res.data ?? []);
      setLoading(false);
    }
    fetchInitialFeeds();
  }, []);

  const handleScroll = throttle((direction: Direction) => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = direction === "left" ? -1 : 1;
    const scrollDistance = ITEMS_PER_VIEW * ITEM_WIDTH * scrollAmount;

    scrollContainerRef.current.scrollBy({
      left: scrollDistance,
      behavior: "smooth",
    });
  }, SCROLL_DELAY);

  const checkScrollability = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - ROUNDING_ERROR);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    checkScrollability();

    scrollContainer.addEventListener("scroll", checkScrollability);
    window.addEventListener("resize", checkScrollability);

    return () => {
      scrollContainer.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [checkScrollability, feeds]);

  return (
    <div className={className}>
      <Card
        className={cn("relative overflow-hidden", "w-full box-content", "flex")}
      >
        <NavigationButton
          direction="left"
          onScroll={handleScroll}
          disabled={!canScrollLeft}
        />
        <div
          ref={scrollContainerRef}
          className={cn(
            "max-w-[32rem] w-full pt-4 pb-2",
            "flex gap-4",
            "overflow-x-auto scrollbar-hide",
            "scroll-smooth snap-x snap-mandatory will-change-scroll transform-gpu"
          )}
        >
          <CreateFeedButton className="snap-start" />
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <FeedItemSkeleton key={index} />
              ))
            : feeds.map((feed) => (
                <FeedItem key={feed.id} data={feed} className="snap-start" />
              ))}
        </div>
        <NavigationButton
          direction="right"
          onScroll={handleScroll}
          disabled={!canScrollRight}
        />
      </Card>
    </div>
  );
}

type NavigationButtonProps = Readonly<{
  direction: Direction;
  onScroll: (direction: Direction) => void;
  disabled?: boolean;
  className?: string;
}>;

function NavigationButton({
  direction,
  onScroll,
  disabled = false,
  className,
}: NavigationButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onScroll(direction)}
      disabled={disabled}
      className={cn(
        "w-8 shrink-0",
        "transition-colors duration-200",
        disabled ? "opacity-30" : "hover:bg-accent/[.05] cursor-pointer",
        className
      )}
    >
      {direction === "left" ? (
        <ChevronLeft className="size-8 -mt-3" />
      ) : (
        <ChevronRight className="size-8 -mt-3" />
      )}
    </button>
  );
}
