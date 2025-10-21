import type { NavItem } from "./types";
import { cn } from "@/libraries/utils";
import Link from "next/link";
import { MOBILE_NAV_HEIGHT } from "@/constants/client";

type MobileHeaderProps = Readonly<{
  items: NavItem[];
  className?: string;
}>;

export default function MobileHeader({ items, className }: MobileHeaderProps) {
  const isNotificationActive = items[0].matchPath?.() ?? false;
  const isActive2 = items[1].matchPath?.() ?? false;

  return (
    <div
      className={cn(
        "px-4",
        "sticky top-0 left-0 right-0 z-20",
        "border-b border-border",
        "bg-background/90 backdrop-blur-md",
        "flex items-center justify-between",
        className
      )}
      style={{ height: MOBILE_NAV_HEIGHT }}
    >
      <Link
        href="/"
        className={cn(
          "text-primary font-semibold text-lg",
          "focus-within-indicator rounded-sm"
        )}
      >
        MomentUp
      </Link>
      <div className="flex items-center">
        <Link
          href={items[0].url}
          className={cn(
            "flex items-center justify-center",
            "p-2",
            "hover:bg-accent/10 focus-within-indicator rounded-sm",
            "transition-colors duration-150 ease-in-out"
          )}
        >
          <span className="flex items-center justify-center size-5">
            {items[0].icon(isNotificationActive)}
          </span>
        </Link>
        <Link
          href={items[1].url}
          className={cn(
            "flex items-center justify-center",
            "p-2 ml-2",
            "hover:bg-accent/10 focus-within-indicator rounded-sm",
            "transition-colors duration-150 ease-in-out"
          )}
        >
          <span className="flex items-center justify-center size-5">
            {items[1].icon(isActive2)}
          </span>
        </Link>
      </div>
    </div>
  );
}
