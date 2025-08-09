"use client";

import type { StoryNotificationInfo } from "api";
import type { Direction } from "./types";

import { useEffect, useRef } from "react";
import useSWRImmutable from "swr/immutable";
import { useAuth } from "@/components/providers";
import { useHome } from "../../_providers/Home";
import { useHorizontalScroll } from "./hooks/useHorizontalScroll";
import { useStory } from "@/components/providers/StoryStorage";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { ApiUrl } from "@/services/api.constant";

import { cn } from "@/libraries/utils";
import { Chevron, MoreHorizontal } from "@/components/icons";
import StoryItem from "./StoryItem";
import StorySkeletons from "./StoriesSkeleton";
import CreateStoryButton from "./CreateStoryButton";

const ITEMS_PER_VIEW = 3;
const ITEM_WIDTH = 88; // size-18 (72px) + gap (16px)

export default function Stories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { token } = useAuth();
  const { allStories, setStories } = useStory();
  const { data, isLoading, error } = useSWRImmutable(
    [ApiUrl.story.get, token.accessToken],
    ([url, token]) =>
      SWRFetcherWithToken<{
        stories: StoryNotificationInfo[];
      }>(url, token)
  );
  const { hideStories, setHideStories } = useHome();

  const { handleScroll, canScrollLeft, canScrollRight } = useHorizontalScroll(
    allStories,
    scrollContainerRef,
    ITEMS_PER_VIEW,
    ITEM_WIDTH
  );

  const isError = !isLoading && (!data || error);
  useEffect(() => {
    if (isError) setHideStories(true);
  }, [isError, setHideStories]);

  useEffect(() => {
    if (data?.stories) setStories(data.stories);
  }, [data?.stories, setStories]);

  if (isLoading && !hideStories) return <StorySkeletons />;
  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 z-10",
        "bg-background/[.93] backdrop-blur-sm",
        hideStories && "-translate-y-[calc(100%-24px)]" // HIDE_OFFSET: -24px
        // "transition-all duration-200"
      )}
      role="region"
      aria-label="Story navigation"
    >
      <div
        className={cn(
          "overflow-hidden",
          "flex",
          "border-b border-border",
          isError && "hidden"
          // "transition-all duration-200",
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
          aria-label="Story items"
        >
          <CreateStoryButton className="snap-start" />
          {allStories.map((story) => (
            <StoryItem key={story?.id} data={story} className="snap-start" />
          ))}
        </div>
        <NavigationButton
          direction="right"
          onScroll={handleScroll}
          disabled={!canScrollRight}
        />
      </div>
      <StoryToggleButton disabled={isError} />
    </div>
  );
}

function StoryToggleButton({
  disabled,
}: Readonly<{
  disabled: boolean;
}>) {
  const { hideStories, setHideStories } = useHome();

  return (
    <button
      onClick={() => setHideStories(!hideStories)}
      disabled={disabled}
      className={cn(
        "flex justify-center items-center",
        "h-6 w-full",
        "border-b border-border",
        "transition-colors duration-200",
        "hover:bg-accent/[.05] cursor-pointer",
        "disabled:hover:bg-transparent disabled:cursor-default"
      )}
      type="button"
      aria-label={hideStories ? "Show stories" : "Hide stories"}
      aria-expanded={!hideStories}
    >
      {disabled ? (
        <MoreHorizontal className="size-4 text-muted-foreground" />
      ) : (
        <Chevron
          direction={hideStories ? "down" : "up"}
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
      disabled ? "text-muted-foreground/50" : "text-foreground"
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
