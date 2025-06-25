import type { NavItem } from "./types";

import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                {!open ? (
                  <Tooltip content={item.title} side="right" sideOffset={6}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        item.matchPath(pathname) &&
                          "font-semibold bg-primary text-white hover:bg-primary/80 hover:text-white"
                      )}
                    >
                      <Link href={item.url}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </Tooltip>
                ) : (
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      item.matchPath(pathname) &&
                        "font-semibold bg-primary text-white hover:bg-primary/80 hover:text-white"
                    )}
                  >
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
