import type { NavItem } from "./types";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Tooltip } from "@/components";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type SidebarBodyProps = Readonly<{
  items: NavItem[];
  open: boolean;
}>;

export default function SidebarBody({ items, open }: SidebarBodyProps) {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
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
                          : "text-foreground dark:text-foreground/[.9]"
                      )}
                    >
                      <Link href={item.url}>
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
                            : "text-foreground dark:text-foreground/[.9]"
                        )}
                      >
                        <Link href={item.url}>
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
