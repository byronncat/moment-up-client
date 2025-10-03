import { type RefObject, useEffect, useState } from "react";

/**
 * Custom hook to detect if text content is clamped (truncated)
 * @param ref - React ref to the element containing the text
 * @returns boolean indicating if the text is clamped
 */
export function useTextClamp<T extends HTMLElement>(
  ref: RefObject<T | null>
): boolean {
  const [isTextClamped, setIsTextClamped] = useState(false);

  useEffect(() => {
    const checkClamping = () => {
      const element = ref.current;
      if (element)
        setIsTextClamped(element.scrollHeight > element.clientHeight);
    };

    checkClamping();
    window.addEventListener("resize", checkClamping);

    let resizeObserver: ResizeObserver | null = null;
    if (ref.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(checkClamping);
      resizeObserver.observe(ref.current);
    }

    return () => {
      window.removeEventListener("resize", checkClamping);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [ref]);

  return isTextClamped;
}
