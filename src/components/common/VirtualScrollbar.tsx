"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/libraries/utils";

type VirtualScrollbarProps = Readonly<{
  height: number;
  totalHeight: number;
  width: number;
  onScroll: (scrollTop: number) => void;
  scrollTop: number;
  className?: string;
}>;

export default function VirtualScrollbar({
  height,
  totalHeight,
  width,
  onScroll,
  scrollTop,
  className,
}: VirtualScrollbarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const animationFrame = useRef(0);

  const { thumbHeight, maxScrollTop, thumbTop } = (() => {
    const thumbHeight = Math.max(30, (height / totalHeight) * height);
    const maxScrollTop = height - thumbHeight;
    const scrollRatio = scrollTop / (totalHeight - height);
    const thumbTop = scrollRatio * maxScrollTop;

    return { thumbHeight, maxScrollTop, thumbTop };
  })();

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
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const startY = e.pageY;
      const startScrollTop = thumbTop;

      const handleMouseMove = (e: MouseEvent) => {
        const delta = e.pageY - startY;
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
        passive: true,
      });
      document.addEventListener("mouseup", handleMouseUp, { passive: true });
    },
    [thumbTop, maxScrollTop, totalHeight, height, handleCustomScroll]
  );

  const handleFastScroll = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const track = e.currentTarget;
      const rect = track.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
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

  if (totalHeight <= height) return null;

  return (
    <div
      className={cn(
        "absolute right-0 top-0",
        "bg-black/10 dark:bg-white/10",
        className
      )}
      style={{ width, height }}
      onMouseDown={handleFastScroll}
    >
      <div
        className={cn(
          "absolute left-[2px]",
          "w-[calc(100%-4px)] rounded-md",
          "cursor-pointer transition-colors duration-150 ease-in-out",
          "will-change-transform",
          "bg-black/20 dark:bg-white/40",
          isDragging && "bg-black/40 dark:bg-white/60"
        )}
        style={{
          top: thumbTop,
          height: thumbHeight,
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
