"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTE } from "@/constants/serverConfig";
import { Camera, Users } from "lucide-react";

type Tab = {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
};

const tabs: Tab[] = [
  {
    id: "media",
    icon: <Camera />,
    label: "Media",
    href: ROUTE.EXPLORE_MEDIA,
  },
  {
    id: "moments",
    icon: <Users />,
    label: "Moments",
    href: ROUTE.EXPLORE_MOMENTS,
  },
];

export function ExploreNavigation({
  className,
}: Readonly<{ className?: string }>) {
  const pathname = usePathname();
  const activeTab = tabs.find((tab) => pathname === tab.href)?.id;

  return (
    <div className={cn("w-full mb-4", "border-b border-border", className)}>
      <div className="flex">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "relative w-1/2",
              "px-6 py-3",
              "transition-colors duration-200 ease-in-out",
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div
              className={cn("flex justify-center items-center gap-2", "w-full")}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </div>
            {activeTab === tab.id && (
              <span
                className={cn(
                  "absolute bottom-0 left-0",
                  "w-full h-0.5 bg-primary"
                )}
              ></span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
