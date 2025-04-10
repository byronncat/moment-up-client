"use client";

import { mockFeeds } from "@/__mocks__";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Plus, User, ChevronLeft, ChevronRight } from "@/components/icons";

export default function Feeds() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const startScrolling = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -1200 : 1200;
      scrollIntervalRef.current = setInterval(() => {
        containerRef.current?.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }, 5);
    }
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  return (
    <Card
      className={cn("pt-4 pb-2", "relative overflow-hidden", "w-full px-8")}
    >
      <div
        ref={containerRef}
        className={cn(
          "max-w-[32rem] mx-auto",
          "flex gap-4",
          "overflow-x-auto scrollbar-hide",
          "scroll-smooth",
          "snap-x snap-mandatory"
        )}
      >
        <button
          type="button"
          className={cn(
            "relative group",
            "cursor-pointer",
            "snap-start snap-always"
          )}
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

        {mockFeeds.map((feed) => (
          <div key={feed.id} className="snap-start snap-always">
            <button type="button" className={cn("group", "cursor-pointer")}>
              <div
                className={cn("flex items-center justify-center", "size-18")}
              >
                <div
                  className={cn(
                    "size-16 rounded-full avatar-container",
                    "flex items-center justify-center",
                    "border-2 border-primary",
                    "transition-all duration-200",
                    "group-hover:scale-105 group-hover:border-primary/70"
                  )}
                >
                  <Avatar className="size-14">
                    <AvatarImage
                      src={feed.image}
                      alt={feed.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary">
                      <User className="size-6 fill-card" type="solid" />
                    </AvatarFallback>
                  </Avatar>
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
                {feed.name}
              </span>
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll("left")}
        onMouseDown={() => startScrolling("left")}
        onMouseUp={stopScrolling}
        onMouseLeave={stopScrolling}
        className={cn(
          "cursor-pointer",
          "w-8 h-full shrink-0",
          "absolute left-0 top-0",
          "transition-colors duration-200",
          "hover:bg-accent/[.05]",
          "border-r border-border"
        )}
      >
        <ChevronLeft className="size-8 -mt-3" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        onMouseDown={() => startScrolling("right")}
        onMouseUp={stopScrolling}
        onMouseLeave={stopScrolling}
        className={cn(
          "cursor-pointer",
          "w-8 h-full shrink-0",
          "absolute right-0 top-0",
          "transition-colors duration-200",
          "hover:bg-accent/[.05]",
          "border-l border-border"
        )}
      >
        <ChevronRight className="size-8 -mt-3" />
      </button>
    </Card>
  );
}
