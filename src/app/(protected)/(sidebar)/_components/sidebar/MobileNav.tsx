import type { NavItem } from "./types";
import { cn } from "@/libraries/utils";
import Link from "next/link";
import { MOBILE_NAV_HEIGHT } from "@/constants/client";

type MobileNavProps = Readonly<{
  items: NavItem[];
}>;

export default function MobileNav({ items }: MobileNavProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 z-20 w-full",
        "bg-background border-t border-border",
        "flex justify-around items-center"
      )}
      style={{ height: MOBILE_NAV_HEIGHT }}
    >
      {items.map((item) => {
        const isActive = item.matchPath?.() ?? false;

        return (
          <Link
            key={item.title}
            href={item.url}
            className={cn(
              "flex items-center justify-center size-10",
              "hover:bg-accent/[.1] focus-indicator rounded-sm",
              "transition-colors duration-150 ease-in-out",
              isActive && "pointer-events-none"
            )}
          >
            {item.icon(isActive)}
          </Link>
        );
      })}
    </div>
  );
}
