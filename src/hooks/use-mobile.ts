import * as React from "react";
import { BreakPoint } from "@/constants/clientConfig";

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BreakPoint.MOBILE - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < BreakPoint.MOBILE);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < BreakPoint.MOBILE);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
