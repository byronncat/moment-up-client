import { useRef, useState, useEffect, useCallback } from "react";

interface UseTextTruncateReturn<T extends HTMLElement = HTMLElement, U extends HTMLElement = HTMLElement> {
  /** Ref to attach to the container element */
  containerRef: React.RefObject<T | null>;
  /** Ref to attach to the text element */
  textRef: React.RefObject<U | null>;
  /** Whether the text is truncated */
  isTruncated: boolean;
  /** Force recalculation of truncation state */
  recalculate: () => void;
}

/**
 * Custom hook to detect if text is truncated within its container
 * 
 * @param text - The text content to check for truncation
 * @returns Object containing refs, truncation state, and recalculate function
 * 
 * @example
 * ```tsx
 * function MyComponent({ text }: { text: string }) {
 *   const { containerRef, textRef, isTruncated } = useTextTruncate(text);
 * 
 *   return (
 *     <div ref={containerRef} className="overflow-hidden w-48">
 *       <span ref={textRef} className="whitespace-nowrap">
 *         {text}
 *       </span>
 *       {isTruncated && <span className="text-xs text-gray-500">...</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTextTruncate<T extends HTMLElement = HTMLDivElement, U extends HTMLElement = HTMLSpanElement>(
  text: string
): UseTextTruncateReturn<T, U> {
  const containerRef = useRef<T>(null);
  const textRef = useRef<U>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const calculateTruncation = useCallback(() => {
    const container = containerRef.current;
    const textElement = textRef.current;
    
    if (!container || !textElement) {
      setIsTruncated(false);
      return;
    }

    const containerWidth = container.offsetWidth;
    const textWidth = textElement.scrollWidth;
    setIsTruncated(textWidth > containerWidth);
  }, []);

  // Recalculate when text changes
  useEffect(() => {
    calculateTruncation();
  }, [text, calculateTruncation]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => calculateTruncation();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateTruncation]);

  // Recalculate when container or text element becomes available
  useEffect(() => {
    if (containerRef.current && textRef.current) {
      // Use setTimeout to ensure elements are fully rendered
      const timer = setTimeout(calculateTruncation, 0);
      return () => clearTimeout(timer);
    }
  }, [calculateTruncation]);

  return {
    containerRef,
    textRef,
    isTruncated,
    recalculate: calculateTruncation
  };
}

export default useTextTruncate;
