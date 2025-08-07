import type { Direction } from "../types";
import { useEffect, useState, useCallback } from "react";

const ROUNDING_ERROR = 1;

export function useHorizontalScroll(
  data: any | undefined,
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
  itemsPerView: number,
  itemWidth: number
) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function handleScroll(direction: Direction) {
    if (!scrollContainerRef?.current) return;

    const scrollAmount = direction === "left" ? -1 : 1;
    const scrollDistance = itemsPerView * itemWidth * scrollAmount;

    scrollContainerRef.current.scrollBy({
      left: scrollDistance,
      behavior: "smooth",
    });
  }

  const checkScrollability = useCallback(() => {
    if (!scrollContainerRef?.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - ROUNDING_ERROR);
  }, [scrollContainerRef]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current;
    if (!scrollContainer) return;
    checkScrollability();

    scrollContainer.addEventListener("scroll", checkScrollability);
    return () => {
      scrollContainer.removeEventListener("scroll", checkScrollability);
    };
  }, [checkScrollability, scrollContainerRef, data]);

  return {
    canScrollLeft,
    canScrollRight,
    handleScroll,
    scrollContainerRef,
  };
}
