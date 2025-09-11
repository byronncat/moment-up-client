import type { NavItem } from "./types";
import { cn } from "@/libraries/utils";
import Link from "next/link";
import { MOBILE_NAV_HEIGHT } from "@/constants/client";

type MobileHeaderProps = Readonly<{
  notificationItem: NavItem;
  profileItem: NavItem;
}>;

export default function MobileHeader({
  notificationItem,
  profileItem,
}: MobileHeaderProps) {
  const isNotificationActive = notificationItem.matchPath?.() ?? false;
  const isProfileActive = profileItem.matchPath?.() ?? false;

  return (
    <div
      className={cn(
        "px-4",
        "fixed top-0 left-0 right-0 z-20",
        "bg-background border-b border-border",
        "flex items-center justify-between"
      )}
      style={{ height: MOBILE_NAV_HEIGHT }}
    >
      <Link
        href="/"
        className={cn(
          "text-primary font-semibold text-lg",
          "focus-indicator rounded-sm"
        )}
      >
        MomentUp
      </Link>
      <div className="flex items-center">
        <Link
          href={notificationItem.url}
          className={cn(
            "flex items-center justify-center",
            "p-2",
            "hover:bg-accent/[.1] focus-indicator rounded-sm",
            "transition-colors duration-150 ease-in-out"
          )}
        >
          <span className="flex items-center justify-center size-5">
            {notificationItem.icon(isNotificationActive)}
          </span>
        </Link>
        <Link
          href={profileItem.url}
          className={cn(
            "flex items-center justify-center",
            "p-2 ml-2",
            "hover:bg-accent/[.1] focus-indicator rounded-sm",
            "transition-colors duration-150 ease-in-out"
          )}
        >
          <span className="flex items-center justify-center size-5">
            {profileItem.icon(isProfileActive)}
          </span>
        </Link>
      </div>
    </div>
  );
}
