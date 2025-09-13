"use client";

import type { Direction } from "./types";

import { useRef } from "react";
import { useStory } from "@/components/providers/StoryStorage";
import { useHorizontalScroll } from "./hooks/useHorizontalScroll";
import { useHomeFeed } from "../../_providers/HomeFeed";

import { cn } from "@/libraries/utils";
import { Chevron } from "@/components/icons";
import StoryItem from "./StoryItem";
import StorySkeletons from "./StoriesSkeleton";
import CreateStoryButton from "./CreateStoryButton";

const ITEMS_PER_VIEW = 3;
const ITEM_GAP = 16;
const ITEM_SIZE = 72;
const ITEM_WIDTH = ITEM_SIZE + ITEM_GAP;

export default function Stories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { allStories } = useStory();
  const { isStoriesLoading: isLoading, isStoriesError: isError } =
    useHomeFeed();
  const { canScrollLeft, canScrollRight, handleScroll } = useHorizontalScroll(
    allStories,
    scrollContainerRef,
    ITEMS_PER_VIEW,
    ITEM_WIDTH
  );

  if (isLoading) return <StorySkeletons />;
  return (
    <div
      role="region"
      aria-label="Story navigation"
      className={cn(
        "flex overflow-hidden",
        "border-b border-border",
        isError && "hidden"
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
          "grow py-4",
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
      aria-label={`Scroll ${direction}`}
    >
      <Chevron
        direction={direction}
        className={cn(
          "size-6 -mt-3",
          "transition-colors duration-200",
          disabled ? "text-muted-foreground/50" : "text-foreground"
        )}
      />
    </button>
  );
}
