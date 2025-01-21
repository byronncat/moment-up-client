"use client";

import Link from "next/link";
import { Compass, Home, SquarePlus, Search, Menu, User } from "lucide-react";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { ROUTE } from "@/constants/serverConfig";
import { sourceCodePro } from "@/styles/fonts";

const items = [
  {
    title: "Home",
    url: ROUTE.HOME,
    icon: Home,
  },
  {
    title: "Search",
    url: "",
    icon: Search,
  },
  {
    title: "Explore",
    url: ROUTE.EXPLORE,
    icon: Compass,
  },
  {
    title: "Create",
    url: "#",
    icon: SquarePlus,
  },
  {
    title: "Profile",
    url: ROUTE.PROFILE("username"),
    icon: User,
  },
];

export default function Sidebar() {
  const { open } = useSidebar();

  return (
    <SidebarUI collapsible="icon">
      <SidebarHeader className="pt-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent"
            >
              {!open && <Logo />}
              <div
                className={cn(
                  "text-primary",
                  "font-bold text-2xl tracking-wide",
                  !open && "hidden",
                  sourceCodePro.className
                )}
              >
                MomentUp
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <Menu />
                <span>More</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {open && (
          <p
            className={cn(
              "text-xs whitespace-nowrap",
              "text-muted-foreground",
              "pl-2"
            )}
          >
            &copy; 2024 Bygram
          </p>
        )}
      </SidebarFooter>
    </SidebarUI>
  );
}
