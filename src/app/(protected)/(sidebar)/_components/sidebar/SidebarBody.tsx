import type { NavItem } from "./types";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Tooltip } from "@/components/common";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type SidebarBodyProps = Readonly<{
  items: NavItem[];
}>;

export default function SidebarBody({ items }: SidebarBodyProps) {
  const { open } = useSidebar();
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              const haveMatchPath = item.matchPath !== undefined;
              const isActive = item.matchPath?.() ?? false;

              return (
                <SidebarMenuItem key={item.title}>
                  {open ? (
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "px-2",
                        isActive
                          ? "font-bold bg-sidebar-accent text-sidebar-accent-foreground pointer-events-none"
                          : "text-foreground dark:text-foreground/90"
                      )}
                    >
                      <Link
                        href={item.url}
                        onMouseDown={(event) => {
                          if (!haveMatchPath) event.preventDefault();
                        }}
                      >
                        <span className="flex items-center justify-center w-5">
                          {item.icon(isActive)}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <Tooltip content={item.title} side="right" sideOffset={6}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          isActive
                            ? "font-bold bg-sidebar-accent text-sidebar-accent-foreground pointer-events-none"
                            : "text-foreground dark:text-foreground/90"
                        )}
                      >
                        <Link
                          href={item.url}
                          onMouseDown={(event) => {
                            if (!haveMatchPath) event.preventDefault();
                          }}
                        >
                          <span
                            className={cn(
                              "flex items-center justify-center",
                              item.title === "Home" ? "px-1.5" : "px-2"
                            )}
                          >
                            {item.icon(isActive)}
                          </span>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </Tooltip>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
