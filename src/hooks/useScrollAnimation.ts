import { useState, useCallback } from "react";

interface UseScrollAnimationOptions {
  /** Scroll speed in pixels per second (default: 20) */
  scrollSpeed?: number;
  /** Minimum animation duration in seconds (default: 3) */
  minDuration?: number;
}

interface UseScrollAnimationReturn {
  /** Animation styles to apply */
  animationStyle: React.CSSProperties;
  /** Calculate animation based on scroll distance */
  calculateAnimation: (scrollDistance: number) => void;
}

/**
 * Custom hook to generate scroll animation styles based on scroll distance
 *
 * @param options - Configuration options for the animation
 * @returns Object containing animation styles and calculation function
 *
 * @example
 * ```tsx
 * function ScrollingText({ text }: { text: string }) {
 *   const { containerRef, textRef, isTruncated } = useTextTruncate(text);
 *   const { animationStyle, calculateAnimation } = useScrollAnimation();
 *
 *   useEffect(() => {
 *     if (isTruncated && containerRef.current && textRef.current) {
 *       const scrollDistance = textRef.current.scrollWidth - containerRef.current.offsetWidth;
 *       calculateAnimation(scrollDistance);
 *     }
 *   }, [isTruncated, calculateAnimation]);
 *
 *   return (
 *     <div ref={containerRef} className="overflow-hidden">
 *       <span
 *         ref={textRef}
 *         className={cn("whitespace-nowrap", isTruncated && "animate-scroll-text")}
 *         style={isTruncated ? animationStyle : undefined}
 *       >
 *         {text}
 *       </span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useScrollAnimation(
  options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn {
  const { scrollSpeed = 20, minDuration = 3 } = options;
  const [animationStyle, setAnimationStyle] = useState<React.CSSProperties>({});

  const calculateAnimation = useCallback(
    (scrollDistance: number) => {
      if (scrollDistance <= 0) {
        setAnimationStyle({});
        return;
      }

      const duration = Math.max(minDuration, scrollDistance / scrollSpeed);

      setAnimationStyle({
        "--scroll-distance": `-${scrollDistance}px`,
        animationDuration: `${duration}s`,
      } as React.CSSProperties);
    },
    [scrollSpeed, minDuration]
  );

  return {
    animationStyle,
    calculateAnimation,
  };
}

export default useScrollAnimation;
