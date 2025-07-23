"use client";

import type { FeedNotificationInfo } from "api";
import type { Direction } from "./types";

import { useEffect, useRef } from "react";
import useSWRImmutable from "swr/immutable";
import { useAuth } from "@/components/providers";
import { useHome } from "../../_providers/Home";
import { useHorizontalScroll } from "./hooks/useHorizontalScroll";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { ApiUrl } from "@/services/api.constant";

import { cn } from "@/libraries/utils";
import { Chevron, MoreHorizontal } from "@/components/icons";
import FeedItem from "./FeedItem";
import FeedSkeletons from "./FeedsSkeleton";
import CreateFeedButton from "./CreateFeedButton";

const ITEMS_PER_VIEW = 3;
const ITEM_WIDTH = 88; // size-18 (72px) + gap (16px)

export default function Feeds() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { token } = useAuth();
  const { data, isLoading, error } = useSWRImmutable(
    [ApiUrl.feed.get, token.accessToken],
    ([url, token]) =>
      SWRFetcherWithToken<{
        feeds: FeedNotificationInfo[];
      }>(url, token)
  );
  const { hideFeeds, setHideFeeds } = useHome();
  const { handleScroll, canScrollLeft, canScrollRight } = useHorizontalScroll(
    scrollContainerRef,
    ITEMS_PER_VIEW,
    ITEM_WIDTH
  );

  useEffect(() => {
    if (error) setHideFeeds(true);
  }, [error, setHideFeeds]);

  if (isLoading && !hideFeeds) return <FeedSkeletons />;
  const isError = !data || error;
  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 z-10",
        "bg-background/[.93] backdrop-blur-sm",
        hideFeeds && "-translate-y-[calc(100%-24px)]", // HIDE_OFFSET: -24px
        "transition-all duration-200"
      )}
      role="region"
      aria-label="Feed navigation"
    >
      {!isError && (
        <div
          className={cn(
            "overflow-hidden",
            "flex",
            "transition-all duration-200",
            "border-b border-border"
          )}
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
            role="list"
            aria-label="Feed items"
          >
            <CreateFeedButton className="snap-start" />
            {data?.feeds.map((feed) => (
              <FeedItem key={feed.id} data={feed} className="snap-start" />
            ))}
          </div>
          <NavigationButton
            direction="right"
            onScroll={handleScroll}
            disabled={!canScrollRight}
          />
        </div>
      )}
      <FeedToggleButton disabled={isError} />
    </div>
  );
}

function FeedToggleButton({
  disabled,
}: Readonly<{
  disabled: boolean;
}>) {
  const { hideFeeds, setHideFeeds, momentLoaded } = useHome();

  return (
    <button
      onClick={() => setHideFeeds(!hideFeeds)}
      disabled={!momentLoaded || disabled}
      className={cn(
        "flex justify-center items-center",
        "h-6 w-full",
        "border-b border-border",
        "transition-colors duration-200",
        "hover:bg-accent/[.05] cursor-pointer",
        "disabled:hover:bg-transparent disabled:cursor-default"
      )}
      type="button"
      aria-label={hideFeeds ? "Show feeds" : "Hide feeds"}
      aria-expanded={!hideFeeds}
    >
      {disabled ? (
        <MoreHorizontal className="size-4 text-muted-foreground" />
      ) : (
        <Chevron
          direction={hideFeeds ? "down" : "up"}
          multiple
          className="size-4 text-muted-foreground"
        />
      )}
    </button>
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
  const chevronProps = {
    className: cn(
      "size-6 -mt-3",
      "transition-colors duration-200",
      disabled ? "fill-muted-foreground/50" : "fill-foreground"
    ),
  };

  return (
    <button
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
      type="button"
      aria-label={`Scroll ${direction}`} // Added accessibility
    >
      <Chevron direction={direction} {...chevronProps} />
    </button>
  );
}
