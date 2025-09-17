import { useAuth } from "@/components/providers/Auth";
import { useProfile } from "../_providers/ProfileProvider";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import UserInfo, { UserInfoSkeleton } from "./user-info";
import { type NavItem, NavigationBar } from "@/components/common";
import { Image as ImageIcon, TableOfContents, Tag } from "@/components/icons";

export const PROFILE_ZONE_HEIGHT = 472;
export default function ProfileZone({
  className,
}: Readonly<{
  className?: string;
}>) {
  const { user } = useAuth();
  const { profile, isProtected } = useProfile();
  const tabs: NavItem[] = [
    {
      id: "moments",
      label: "Moments",
      icon: <TableOfContents className="size-4" />,
      href: ROUTE.PROFILE(profile.username),
    },
    {
      id: "media",
      label: "Media",
      icon: <ImageIcon className="size-4" />,
      href: user ? ROUTE.PROFILE(profile.username, "media") : ROUTE.LOGIN,
    },
    {
      id: "tagged",
      label: "Tagged",
      icon: <Tag className="size-4" />,
      href: user ? ROUTE.PROFILE(profile.username, "tagged") : ROUTE.LOGIN,
    },
  ];

  return (
    <div className={className}>
      <UserInfo />
      {isProtected ? null : (
        <NavigationBar
          items={tabs}
          className={cn("w-full", "border-y border-border")}
        />
      )}
    </div>
  );
}

export function ProfileZoneSkeleton() {
  const tabs: NavItem[] = [
    {
      id: "moments",
      label: "Moments",
      icon: <TableOfContents className="size-4" />,
    },
    {
      id: "media",
      label: "Media",
      icon: <ImageIcon className="size-4" />,
    },
    {
      id: "tagged",
      label: "Tagged",
      icon: <Tag className="size-4" />,
    },
  ];

  return (
    <div className={cn("w-full relative", "flex flex-col items-center")}>
      <UserInfoSkeleton />
      <NavigationBar
        items={tabs}
        className={cn("w-full", "border-y border-border")}
      />
    </div>
  );
}
