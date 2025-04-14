"use client";

import { cn } from "@/lib/utils";
import { ExploreNavigation } from "./_components";

export default function ExploreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cn("flex flex-col", "pt-0 sm:pt-2 pb-10")}>
      <ExploreNavigation className="mb-8" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
