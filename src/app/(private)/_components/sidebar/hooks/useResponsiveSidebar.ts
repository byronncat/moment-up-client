import { useEffect, useState, useRef } from "react";
import { useSidebar, SIDEBAR_COOKIE_NAME } from "@/components/ui/sidebar";
import ClientCookie from "@/helpers/client-cookie";
import { XL_BREAKPOINT } from "@/constants/clientConfig";

export function useResponsiveSidebar() {
  const { open, setOpen } = useSidebar();
  const [isAboveXl, setIsAboveXl] = useState(false);
  const userPreferenceRef = useRef<boolean | null>(null);
  const isFirstRender = useRef(true);

  const sidebarCookie = ClientCookie(SIDEBAR_COOKIE_NAME);

  useEffect(() => {
    const cookieValue = sidebarCookie.get();
    const storedState = cookieValue ? cookieValue === "true" : null;
    userPreferenceRef.current = storedState ?? true;
  }, [sidebarCookie]);

  useEffect(() => {
    const handleResize = () => {
      const isXl = window.innerWidth >= XL_BREAKPOINT;

      if (isFirstRender.current) {
        setIsAboveXl(isXl);
        setOpen(isXl ? (userPreferenceRef.current ?? true) : false);
        isFirstRender.current = false;
        return;
      }

      if (isXl !== isAboveXl) {
        if (isXl) {
          setOpen(userPreferenceRef.current ?? true);
        } else {
          userPreferenceRef.current = open;
          setOpen(false);
        }
        setIsAboveXl(isXl);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open, setOpen, isAboveXl]);

  useEffect(() => {
    if (isAboveXl) userPreferenceRef.current = open;
  }, [open, isAboveXl]);

  return { open, isAboveXl };
}
