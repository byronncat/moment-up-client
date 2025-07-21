"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { cn } from "@/libraries/utils";

const SCROLLBAR_WIDTH = 12;

type VirtualScrollbarProps = Readonly<{
  height: number;
  width?: number;
  totalHeight: number;
  onScroll: (scrollTop: number) => void;
  onScrollUpdate?: (updateFn: (scrollTop: number) => void) => void;
  className?: string;
}>;

export default function VirtualScrollbar({
  height,
  totalHeight,
  width = SCROLLBAR_WIDTH,
  onScroll,
  onScrollUpdate,
  className,
}: VirtualScrollbarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const animationFrame = useRef(0);

  const { thumbHeight, maxScrollTop, thumbTop } = (() => {
    const thumbHeight = Math.max(30, (height / totalHeight) * height);
    const maxScrollTop = height - thumbHeight;
    const scrollRatio = scrollTop / (totalHeight - height);
    const thumbTop = scrollRatio * maxScrollTop;

    return { thumbHeight, maxScrollTop, thumbTop };
  })();

  const updateScrollPosition = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
  }, []);

  const handleCustomScroll = useCallback(
    (newScrollTop: number) => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      animationFrame.current = requestAnimationFrame(() => {
        onScroll(newScrollTop);
      });
    },
    [onScroll]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setIsDragging(true);

      const startY = event.pageY;
      const startScrollTop = thumbTop;

      const handleMouseMove = (event: MouseEvent) => {
        const delta = event.pageY - startY;
        const newThumbTop = Math.max(
          0,
          Math.min(maxScrollTop, startScrollTop + delta)
        );
        const newScrollTop =
          (newThumbTop / maxScrollTop) * (totalHeight - height);

        handleCustomScroll(newScrollTop);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp);
    },
    [thumbTop, maxScrollTop, totalHeight, height, handleCustomScroll]
  );

  const handleFastScroll = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const track = event.currentTarget;
      const rect = track.getBoundingClientRect();
      const clickY = event.clientY - rect.top;
      if (clickY >= thumbTop && clickY <= thumbTop + thumbHeight) return;
      const newThumbTop = Math.max(
        0,
        Math.min(maxScrollTop, clickY - thumbHeight / 2)
      );
      const newScrollTop =
        (newThumbTop / maxScrollTop) * (totalHeight - height);
      handleCustomScroll(newScrollTop);
    },
    [
      thumbTop,
      thumbHeight,
      maxScrollTop,
      totalHeight,
      height,
      handleCustomScroll,
    ]
  );

  useEffect(() => {
    onScrollUpdate?.(updateScrollPosition);
  }, [onScrollUpdate, updateScrollPosition]);

  if (totalHeight <= height) return null;
  return (
    <div
      className={cn(
        "absolute right-0 top-0",
        "touch-none select-none",
        "p-px transition-colors",
        className
      )}
      style={{ width, height }}
      onMouseDown={handleFastScroll}
    >
      <div
        className={cn(
          "absolute left-[2px]",
          "w-[calc(100%-4px)] rounded-full",
          "cursor-pointer transition-colors duration-150 ease-in-out",
          "will-change-transform",
          "bg-accent/30 relative flex-1",
          isDragging
            ? "bg-accent/50"
            : "transition-transform duration-75 ease-in-out"
        )}
        style={{
          transform: `translateY(${thumbTop}px)`,
          height: thumbHeight,
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
