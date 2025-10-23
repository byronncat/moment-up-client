"use client";

import { cn } from "@/libraries/utils";
import { useSidebar } from "@/components/ui/sidebar";

export default function SettingsPage() {
  return (
    <div className="flex size-full">
      <NavigationMenu />
    </div>
  );
}

function NavigationMenu() {
  const { open } = useSidebar();
  return (
    <div
      className={cn("w-[300px] h-full bg-sidebar", "border-r border-border")}
    >
      <h1 className={cn("pt-5 px-4", "text-2xl font-bold", "w-fit mx-auto")}>
        {open ? "Settings" : "Settings (sidebar)"}
      </h1>
    </div>
  );
}
