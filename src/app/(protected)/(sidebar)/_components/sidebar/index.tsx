"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers";
import { useResponsiveSidebar } from "./hooks/useResponsiveSidebar";
import { getNavigationItems } from "./config/navigationItems";

import { cn } from "@/libraries/utils";
import {
  Sidebar as SidebarUI,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import MobileHeader from "./MobileHeader";
import MobileNav from "./MobileNav";
import SidebarHeader from "./SidebarHeader";
import SidebarBody from "./SidebarBody";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isMobile } = useSidebar();
  const { open, isAboveXl } = useResponsiveSidebar();

  if (!user) return null;
  const items = getNavigationItems(pathname, user?.username);
  const [notificationItem, profileItem] = items.slice(-2);

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
          <MobileHeader
            notificationItem={notificationItem}
            profileItem={profileItem}
          />
          <MobileNav items={items.slice(0, 5)} />
        </>
      )}
    </>
  );
}
