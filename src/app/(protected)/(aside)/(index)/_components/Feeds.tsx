"use client";

import type { FeedNotification } from "api";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CoreApi } from "@/services";
import { ROUTE } from "@/constants/clientConfig";

import { Avatar } from "@/components";
import { Card } from "@/components/ui/card";
import { Plus, ChevronLeft, ChevronRight } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

type Direction = "left" | "right";
const ITEMS_PER_VIEW = 3;
const ITEM_WIDTH = 88; // size-18 (72px) + gap (16px)

function throttle(callback: (direction: Direction) => void, delay: number) {
  let isThrottled = false;
  return (direction: Direction) => {
    if (isThrottled) return;
    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, delay);
    callback(direction);
  };
}

export default function Feeds({ className }: ComponentProps) {
  const [feeds, setFeeds] = useState<FeedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(3);
    async function fetchFeeds() {
      const res = await CoreApi.getFeeds();
      if (res.success) setFeeds(res.data ?? []);
      setLoading(false);
    }
    fetchFeeds();
  }, []);

  const checkScrollability = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 for rounding errors
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

  const handleScroll = throttle((direction: Direction) => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = direction === "left" ? -1 : 1;
    const scrollDistance = ITEMS_PER_VIEW * ITEM_WIDTH * scrollAmount;

    scrollContainerRef.current.scrollBy({
      left: scrollDistance,
      behavior: "smooth",
    });
  }, 150);

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
            "max-w-[32rem] w-full",
            "pt-4 pb-2",
            "flex gap-4",
            "overflow-x-auto scrollbar-hide",
            "scroll-smooth",
            "snap-x snap-mandatory",
            "will-change-scroll transform-gpu"
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

type FeedItemProps = ComponentProps<{
  data: FeedNotification;
}>;

function FeedItem({ data, className }: FeedItemProps) {
  return (
    <div className={className}>
      <Link
        href={ROUTE.FEED(data.id)}
        className={cn("group", "cursor-pointer", "flex flex-col items-center")}
      >
        <div className={cn("flex items-center justify-center", "size-18")}>
          <Avatar
            src={data.user.avatar}
            alt={`${data.user.displayName}'s avatar`}
            size="14"
            ring
            className={cn(
              "transition-all duration-200",
              "group-hover:scale-105 group-hover:border-primary/70"
            )}
          />
        </div>
        <span
          className={cn(
            "text-xs font-semibold",
            "inline-block",
            "max-w-16 truncate text-center",
            "transition-colors group-hover:text-primary"
          )}
        >
          {data.user.displayName}
        </span>
      </Link>
    </div>
  );
}

function CreateFeedButton({ className }: ComponentProps) {
  return (
    <button
      type="button"
      className={cn("relative group", "cursor-pointer", className)}
    >
      <div className={cn("flex items-center justify-center", "size-18")}>
        <div
          className={cn(
            "size-16 rounded-full bg-primary/20",
            "flex items-center justify-center",
            "border-2 border-primary",
            "transition-all duration-200",
            "group-hover:scale-105 group-hover:border-primary/70"
          )}
        >
          <Plus className="size-6 text-card-foreground fill-primary" />
        </div>
      </div>
      <span
        className={cn(
          "text-xs font-semibold",
          "inline-block",
          "max-w-16 truncate text-center",
          "transition-colors group-hover:text-primary"
        )}
      >
        Create
      </span>
    </button>
  );
}

type NavigationButtonProps = ComponentProps<{
  direction: Direction;
  onScroll: (direction: Direction) => void;
  disabled?: boolean;
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

function FeedItemSkeleton() {
  return (
    <div className={cn("flex flex-col items-center", "h-24")}>
      <div className={cn("flex items-center justify-center", "size-18")}>
        <Skeleton className="size-16 rounded-full" />
      </div>
      <Skeleton className="w-16 h-3 mt-0.5" />
    </div>
  );
}
