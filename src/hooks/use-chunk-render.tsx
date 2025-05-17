import { useState, useEffect, useRef } from "react";

interface UseChunkRenderOptions {
  chunkSize?: number;
  threshold?: number;
  enabled?: boolean;
}

interface UseChunkRenderResult {
  /** Number of items that should be shown */
  itemsToShow: number;
  /** Whether there are more chunks to render */
  hasMoreChunks: boolean;
  /** Ref to attach to the chunk loader element */
  chunkLoaderRef: React.RefObject<HTMLDivElement | null>;
  /** Reset the chunk render state */
  reset: () => void;
}

export function useChunkRender<T>(
  items: T[],
  { chunkSize = 3, threshold = 0.1, enabled = true }: UseChunkRenderOptions = {}
): UseChunkRenderResult {
  const [visibleChunks, setVisibleChunks] = useState(1);
  const chunkLoaderRef = useRef<HTMLDivElement | null>(null);
  const prevItemsLengthRef = useRef(items.length);

  useEffect(() => {
    if (items.length < prevItemsLengthRef.current) setVisibleChunks(1);
    prevItemsLengthRef.current = items.length;
  }, [items]);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const totalChunks = Math.ceil(items.length / chunkSize);
            if (visibleChunks < totalChunks) {
              setVisibleChunks((prev) => prev + 1);
            }
          }
        });
      },
      { threshold }
    );

    const currentRef = chunkLoaderRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.disconnect();
    };
  }, [items, visibleChunks, chunkSize, enabled, threshold]);

  const itemsToShow = visibleChunks * chunkSize;
  const hasMoreChunks = items.length > itemsToShow;

  return {
    itemsToShow,
    hasMoreChunks,
    chunkLoaderRef,
    reset: () => setVisibleChunks(1),
  };
}
