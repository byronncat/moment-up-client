import { useEffect, useRef, useState, useCallback } from "react";

interface UseInfiniteScrollOptions {
  /** Threshold value for the Intersection Observer (0 to 1) */
  threshold?: number;
  /** Root margin for the Intersection Observer (CSS-style margin string) */
  rootMargin?: string;
  /** Whether the infinite scroll functionality is enabled */
  enabled?: boolean;
}

interface UseInfiniteScrollResult<T> {
  /** Ref to attach to the loader element */
  loaderRef: React.RefObject<HTMLDivElement | null>;
  /** Whether data is currently being fetched */
  isLoading: boolean;
  /** Whether there is more data to load */
  hasMore: boolean;
  /** The current array of items */
  items: T[] | null;
  /** Function to manually set items */
  setItems: React.Dispatch<React.SetStateAction<T[] | null>>;
  /** Function to load more items */
  loadMore: (fetchFn: (page: number) => Promise<T[]>) => Promise<void>;
  /** Function to reset the infinite scroll state */
  reset: () => void;
  /** Current page number */
  page: number;
  /** Current error state */
  error: Error | null;
}

/**
 * A hook for implementing infinite scroll functionality
 * @param options Configuration options for the infinite scroll
 * @returns An object containing the infinite scroll state and controls
 */
export function useInfiniteScroll<T>({
  threshold = 0.1,
  rootMargin = "0px",
  enabled = true,
}: UseInfiniteScrollOptions = {}): UseInfiniteScrollResult<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const page = useRef(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const fetchFnRef = useRef<((page: number) => Promise<T[]>) | null>(null);

  const loadMore = useCallback(
    async (fetchFn: (page: number) => Promise<T[]>) => {
      if (isLoading || !hasMore) return;
      fetchFnRef.current = fetchFn;
      setIsLoading(true);
      setError(null);

      try {
        const newItems = await fetchFn(page.current);

        if (!Array.isArray(newItems)) {
          throw new Error("Fetch function must return an array");
        }

        if (newItems.length === 0) {
          setHasMore(false);
        } else {
          setItems((prev) => [...(prev ?? []), ...newItems]);
          page.current += 1;
        }
        setError(null);
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error("An error occurred")
        );
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore]
  );

  const reset = useCallback(() => {
    setItems(null);
    setHasMore(true);
    setIsLoading(false);
    page.current = 1;
    fetchFnRef.current = null;
  }, []);

  const handleIntersection = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading && fetchFnRef.current) {
        await loadMore(fetchFnRef.current);
      }
    },
    [hasMore, isLoading, loadMore]
  );

  useEffect(() => {
    if (!enabled) return;
    const currentObserver = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef && hasMore) currentObserver.observe(currentLoaderRef);
    return () => {
      currentObserver.disconnect();
    };
  }, [enabled, hasMore, threshold, rootMargin, handleIntersection]);

  return {
    loaderRef,
    isLoading,
    hasMore,
    items,
    setItems,
    loadMore,
    reset,
    page: page.current,
    error,
  };
}
