import type { NavItem } from "./types";
import { cn } from "@/libraries/utils";
import Link from "next/link";

type MobileNavProps = Readonly<{
  items: NavItem[];
}>;

export default function MobileNav({ items }: MobileNavProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 z-20 w-full",
        "bg-background border-t border-border",
        "flex justify-around items-center",
        "p-2"
      )}
    >
      {items.map((item) => {
        const isActive = item.matchPath?.() ?? false;

        return (
          <Link
            key={item.title}
            href={item.url}
            className={cn(
              "flex items-center justify-center size-10",
              "hover:bg-accent/[.1] focus-indicator rounded-md",
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
