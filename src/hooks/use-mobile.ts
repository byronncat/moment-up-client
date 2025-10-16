import { useEffect, useState } from "react";
import { BreakPoint } from "@/constants/client";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth <= BreakPoint.MOBILE
      : false
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BreakPoint.MOBILE}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth <= BreakPoint.MOBILE);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
