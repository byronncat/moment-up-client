"use client";

import { cn } from "@/lib/utils";
import { ROUTE } from "@/constants/serverConfig";
import { Image, Users } from "lucide-react";
import { type NavItem, NavigationBar } from "@/components";

const tabs: NavItem[] = [
  {
    id: "media",
    icon: <Image />,
    label: "Media",
    href: ROUTE.EXPLORE("media"),
  },
  {
    id: "moments",
    icon: <Users />,
    label: "Moments",
    href: ROUTE.EXPLORE("moments"),
  },
];

export default function ExploreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cn("flex flex-col", "pt-0 sm:pt-2 pb-10")}>
      <NavigationBar items={tabs} className="mb-8" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
