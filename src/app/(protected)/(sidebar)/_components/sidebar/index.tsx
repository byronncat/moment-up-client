"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers";
import { useResponsiveSidebar } from "./hooks/useResponsiveSidebar";
import { getNavigationItems } from "./config/navigationItems";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import {
  SidebarTrigger,
  Sidebar as SidebarUI,
  useSidebar,
} from "@/components/ui/sidebar";
import MobileHeader from "./MobileHeader";
import MobileNav from "./MobileNav";
import SidebarHeader from "./SidebarHeader";
import SidebarBody from "./SidebarBody";
import SidebarFooter from "./SidebarFooter";
import { sourceCodePro } from "@/styles/fonts";

export default function Sidebar({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isMobile } = useSidebar();
  const { open, isAboveXl } = useResponsiveSidebar();

  if (!user)
    return (
      <Link
        href={ROUTE.LOGIN}
        className={cn(
          "text-primary",
          "font-bold text-2xl tracking-wide",
          "px-4 py-3 h-fit",
          "hidden xl:block",
          "select-none",
          sourceCodePro.className
        )}
      >
        MomentUp
      </Link>
    );
  const items = getNavigationItems(pathname, user?.username);
  const [notificationItem, profileItem] = items.slice(-2);

  return (
    <>
      <SidebarUI collapsible="icon">
        <SidebarHeader />
        <SidebarBody items={items} />
        <SidebarFooter />
      </SidebarUI>

      {isAboveXl ? (
        <div
          className={cn(
            "fixed top-5 left-14 z-10",
            "transition-all duration-300",
            open
              ? "opacity-0 pointer-events-none translate-x-2"
              : "opacity-100 translate-x-0"
          )}
        >
          <SidebarTrigger
            className="text-foreground"
            tabIndex={open ? -1 : 0}
          />
        </div>
      ) : null}

      {isMobile ? (
        <div className="flex flex-col size-full">
          <MobileHeader
            notificationItem={notificationItem}
            profileItem={profileItem}
          />

          {children}

          <MobileNav items={items.slice(0, 5)} />
        </div>
      ) : (
        children
      )}
    </>
  );
}
