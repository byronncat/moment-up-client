import { useEffect, useRef, useState, useCallback } from "react";

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useInfiniteScroll<T>({
  threshold = 0.1,
  rootMargin = "0px",
  enabled = true,
}: UseInfiniteScrollOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState<T[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const page = useRef(1);
  const fetchFnRef = useRef<((page: number) => Promise<T[]>) | null>(null);

  const loadMore = useCallback(
    async (fetchFn: (page: number) => Promise<T[]>) => {
      if (isLoading || !hasMore) return;

      // Store the fetch function for use in the intersection observer
      fetchFnRef.current = fetchFn;

      setIsLoading(true);
      try {
        const newItems = await fetchFn(page.current);

        if (newItems.length === 0) {
          setHasMore(false);
        } else {
          setItems((prev) => [...prev, ...newItems]);
          page.current += 1;
        }
      } catch (error) {
        console.error("Error loading more items:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore]
  );

  const reset = useCallback(() => {
    setItems([]);
    setHasMore(true);
    page.current = 1;
    setIsLoading(false);
  }, []);

  // Handle intersection observer
  useEffect(() => {
    if (!enabled || !hasMore) return;

    const handleIntersection = async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading && fetchFnRef.current) {
        await loadMore(fetchFnRef.current);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.disconnect();
      }
    };
  }, [hasMore, isLoading, enabled, threshold, rootMargin, loadMore]);

  return {
    loaderRef,
    isLoading,
    hasMore,
    items,
    setItems,
    loadMore,
    reset,
    page: page.current,
  };
}
