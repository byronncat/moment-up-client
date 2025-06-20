import { useRef } from "react";
import { VirtualScrollbar } from "@/components";
import { useWindowSize, useResizeObserver } from "usehooks-ts";

export default function ScrollArea({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const updateScrollbarRef = useRef<(scrollTop: number) => void>(() => {});
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useWindowSize();
  const { height: totalHeight } = useResizeObserver({
    ref: containerRef as React.RefObject<HTMLElement>,
  });

  const handleCustomScroll = (newScrollTop: number) => {
    if (scrollableRef.current) scrollableRef.current.scrollTop = newScrollTop;
  };

  const handleScroll = () => {
    if (scrollableRef.current)
      updateScrollbarRef.current?.(scrollableRef.current.scrollTop);
  };

  return (
    <div className="size-full overflow-hidden">
      <div
        ref={scrollableRef}
        className="size-full overflow-y-auto scrollbar-hide"
        onScroll={handleScroll}
      >
        <div ref={containerRef}>{children}</div>
      </div>
      <VirtualScrollbar
        height={height}
        width={12}
        totalHeight={totalHeight ?? 0}
        onScroll={handleCustomScroll}
        onScrollUpdate={(updateFn) => {
          updateScrollbarRef.current = updateFn;
        }}
        className="[@media(max-width:calc(640px+48px+32px))]:hidden"
      />
    </div>
  );
}
