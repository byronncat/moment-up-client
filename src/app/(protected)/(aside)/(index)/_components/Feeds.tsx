"use client";

import type { API, FeedNotification } from "api";

import { useEffect, useRef, useState, useCallback, use } from "react";
import throttle from "@/helpers/throttle";

import { cn } from "@/libraries/utils";
import FeedItem, { CreateFeedButton } from "./FeedItem";
import { Chevron } from "@/components/icons";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { useHome } from "../_providers/Home";

type Direction = "left" | "right";
const ITEMS_PER_VIEW = 3;
const ITEM_WIDTH = 88; // size-18 (72px) + gap (16px)
const ROUNDING_ERROR = 1;
const SCROLL_DELAY = 150;

export default function Feeds({
  className,
  initialRes,
}: Readonly<{
  className?: string;
  initialRes: Promise<API<FeedNotification[]>>;
}>) {
  const response = use(initialRes);
  const feeds = response?.data ?? [];
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { hideFeeds, setHideFeeds } = useHome();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
  }, [checkScrollability]);

  return (
    <div
      className={cn(
        className,
        "absolute top-0 left-0 right-0 z-10",
        "bg-background/[.93] backdrop-blur-sm",
        hideFeeds && "-translate-y-[calc(100%-1.5rem)]",
        "transition-all duration-200"
      )}
    >
      <div
        className={cn("overflow-hidden", "flex", "transition-all duration-200")}
      >
        <NavigationButton
          direction="left"
          onScroll={handleScroll}
          disabled={!canScrollLeft}
        />
        <div
          ref={scrollContainerRef}
          className={cn(
            "grow pt-4 pb-2",
            "flex gap-3",
            "overflow-x-auto scrollbar-hide",
            "scroll-smooth snap-x snap-mandatory will-change-scroll transform-gpu"
          )}
        >
          <CreateFeedButton className="snap-start" />
          {feeds.map((feed) => (
            <FeedItem key={feed.id} data={feed} className="snap-start" />
          ))}
        </div>
        <NavigationButton
          direction="right"
          onScroll={handleScroll}
          disabled={!canScrollRight}
        />
      </div>
      <button
        type="button"
        className={cn(
          "flex justify-center items-center",
          "h-6 w-full",
          "border-y border-border",
          "transition-colors duration-200",
          "hover:bg-accent/[.05] cursor-pointer"
        )}
        onClick={() => setHideFeeds(!hideFeeds)}
      >
        {hideFeeds ? (
          <ChevronsDown className="size-4 text-muted-foreground" />
        ) : (
          <ChevronsUp className="size-4 text-muted-foreground" />
        )}
      </button>
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
        "flex items-center justify-center",
        direction === "left"
          ? "border-r border-border"
          : "border-l border-border",
        !disabled && "hover:bg-accent/[.05] cursor-pointer",
        className
      )}
    >
      {direction === "left" ? (
        <Chevron
          direction="left"
          className={cn(
            "size-6 -mt-3",
            disabled ? "fill-muted-foreground/50" : "fill-foreground",
            "transition-colors duration-200"
          )}
        />
      ) : (
        <Chevron
          direction="right"
          className={cn(
            "size-6 -mt-3",
            disabled ? "fill-muted-foreground/50" : "fill-foreground",
            "transition-colors duration-200"
          )}
        />
      )}
    </button>
  );
}
