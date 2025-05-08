"use client";

import { cn } from "@/lib/utils";
import { ROUTE } from "@/constants/clientConfig";
import NavigationBar, {
  type NavItem,
} from "@/components/HorizontalNavigationBar";
import { Button } from "@/components/ui/button";
import { Cog, Bell, User } from "lucide-react";

const tabs: NavItem[] = [
  {
    id: "all",
    label: "All",
    href: ROUTE.NOTIFICATION("all"),
  },
  {
    id: "mentions",
    label: "Mentions",
    href: ROUTE.NOTIFICATION("mentions"),
  },
];

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cn("flex flex-col", "border-x border-border")}>
      <div className="sticky top-0 z-10 bg-background">
        <div
          className={cn(
            "flex justify-between items-center",
            "p-4 border-b border-border"
          )}
        >
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Cog className="size-5" />
          </Button>
        </div>

        <NavigationBar items={tabs} />
      </div>

      <div className="flex flex-col overflow-y-auto">{children}</div>
    </div>
  );
}
