"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers";
import { useResponsiveSidebar } from "./hooks/useResponsiveSidebar";
import { ItemIndex, getNavigationItems } from "./config/navigationItems";
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

  const items = getNavigationItems(pathname, user?.username);
  const profileItem = items[ItemIndex.PROFILE];
  const isProfilePath = profileItem.matchPath?.() ?? false;
  const isSearchPath = items[ItemIndex.SEARCH].matchPath?.() ?? false;

  return (
    <>
      {user ? (
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
        </>
      ) : (
        <Link
          href={ROUTE.LOGIN}
          className={cn(
            "sticky top-0 left-0 right-0",
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
      )}

      {isMobile && user ? (
        <div className="flex flex-col size-full">
          {!(isProfilePath || isSearchPath) && (
            <MobileHeader
              items={[
                items[ItemIndex.NOTIFICATIONS],
                items[ItemIndex.MESSAGES],
              ]}
              className={isSearchPath ? "border-transparent" : "border-border"}
            />
          )}

          {children}

          <MobileNav
            items={items
              .slice(ItemIndex.HOME, ItemIndex.CREATE + 1)
              .concat(profileItem)}
          />
        </div>
      ) : (
        children
      )}
    </>
  );
}
