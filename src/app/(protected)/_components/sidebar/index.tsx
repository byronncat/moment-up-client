"use client";

import type { NavItem } from "./types";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/providers";
import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/clientConfig";

import MobileHeader from "./MobileHeader";
import MobileNav from "./MobileNav";
import SidebarHeader from "./SidebarHeader";
import SidebarBody from "./SidebarBody";
import SidebarFooter from "./SidebarFooter";

import {
  Sidebar as SidebarUI,
  SidebarTrigger,
  useSidebar,
  SIDEBAR_COOKIE_NAME,
} from "@/components/ui/sidebar";
import {
  Message,
  Compass,
  SquarePlus,
  Bell,
  Archive,
  MagnifyingGlass,
  User,
  House,
} from "@/components/icons";

const XL_BREAKPOINT = 1280;

export default function Sidebar() {
  const { user } = useAuth();
  const { open, setOpen, isMobile } = useSidebar();
  const pathname = usePathname();

  const [isAboveXl, setIsAboveXl] = useState(false);
  const userPreferenceRef = useRef<boolean | null>(null);
  const isFirstRender = useRef(true);

  const items: NavItem[] = [
    {
      title: "Home",
      url: ROUTE.HOME,
      icon: (open) => (
        <House
          type={open ? "solid" : "regular"}
          className="size-7 laptop:size-5"
        />
      ),
      matchPath: () => pathname === ROUTE.HOME,
    },
    {
      title: "Search",
      url: ROUTE.SEARCH(),
      icon: () => (
        <MagnifyingGlass className="size-5 laptop:size-4" />
      ),
      matchPath: () => pathname.startsWith(ROUTE.SEARCH()),
    },
    {
      title: "Explore",
      url: ROUTE.EXPLORE(),
      icon: (open) => (
        <Compass
          type={open ? "solid" : "regular"}
          className="size-5 laptop:size-4"
        />
      ),
      matchPath: () => pathname.startsWith(ROUTE.EXPLORE()),
    },
    {
      title: "Create",
      url: "#",
      icon: () => (
        <SquarePlus className="size-5 laptop:size-4" />
      ),
    },
    {
      title: "Messages",
      url: ROUTE.MESSAGES,
      icon: () => (
        <Message
          variant="square"
          multiple
          className="size-5 laptop:size-4"
        />
      ),
      matchPath: () => pathname === ROUTE.MESSAGES,
    },
    {
      title: "Archive",
      url: ROUTE.ARCHIVE,
      icon: () => (
        <Archive className="size-5 laptop:size-4" />
      ),
      matchPath: () => pathname.startsWith(ROUTE.ARCHIVE),
    },
    {
      title: "Notifications",
      url: ROUTE.NOTIFICATION(),
      icon: (open) => (
        <Bell
          variant={open ? "solid" : "regular"}
          className="size-5 laptop:size-4"
        />
      ),
      matchPath: () => pathname.startsWith(ROUTE.NOTIFICATION()),
    },
    {
      title: "Profile",
      url: user?.username ? ROUTE.PROFILE(user.username) : "#",
      icon: (open) => (
        <User
          type={open ? "solid" : "regular"}
          className="size-5 laptop:size-4"
        />
      ),
      matchPath: () => pathname.startsWith("/profile"),
    },
  ];

  function getSidebarCookie(): boolean | null {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${SIDEBAR_COOKIE_NAME}=`));
    return cookie ? cookie.split("=")[1] === "true" : null;
  }

  useEffect(() => {
    const storedState = getSidebarCookie();
    if (storedState !== null) userPreferenceRef.current = storedState;
    else userPreferenceRef.current = true;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isXl = window.innerWidth >= XL_BREAKPOINT;

      if (isFirstRender.current) {
        setIsAboveXl(isXl);

        if (isXl) {
          const preferredState =
            userPreferenceRef.current !== null
              ? userPreferenceRef.current
              : true;
          setOpen(preferredState);
        } else setOpen(false);

        isFirstRender.current = false;
        return;
      }

      if (isXl !== isAboveXl) {
        if (isXl) {
          const preferredState =
            userPreferenceRef.current !== null
              ? userPreferenceRef.current
              : true;
          setOpen(preferredState);
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

  return (
    <>
      <SidebarUI collapsible="icon">
        <SidebarHeader open={open} />
        <SidebarBody items={items} open={open} />
        <SidebarFooter open={open} />
      </SidebarUI>

      {isAboveXl && (
        <div
          className={cn(
            "fixed top-5 left-14 z-10",
            "transition-all duration-300",
            open
              ? "opacity-0 pointer-events-none translate-x-2"
              : "opacity-100 translate-x-0"
          )}
        >
          <SidebarTrigger className="text-foreground" />
        </div>
      )}

      {isMobile && (
        <>
          <MobileHeader notificationItem={items[6]} profileItem={items[7]} />
          <MobileNav items={items.slice(0, 5)} />
        </>
      )}
    </>
  );
}
