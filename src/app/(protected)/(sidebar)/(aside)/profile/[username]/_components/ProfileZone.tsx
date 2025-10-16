import { useAuth } from "@/components/providers/Auth";
import { useProfile } from "../_providers/Profile";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import UserInfo, { UserInfoSkeleton } from "./user-info";
import { type NavItem, NavigationBar } from "@/components/common";
import { Header } from "./ProfileLayout";
import { Image as ImageIcon, TableOfContents } from "@/components/icons";

export const PROFILE_ZONE_HEIGHT = 472;
export default function ProfileZone({
  className,
}: Readonly<{
  className?: string;
}>) {
  const { user } = useAuth();
  const { profile, canView } = useProfile();
  const tabs: NavItem[] = [
    {
      id: "posts",
      label: "Posts",
      icon: <TableOfContents className="size-4" />,
      href: ROUTE.PROFILE(profile.username),
    },
    {
      id: "media",
      label: "Media",
      icon: <ImageIcon className="size-4" />,
      href: user ? ROUTE.PROFILE(profile.username, "media") : ROUTE.LOGIN,
    },
  ];

  return (
    <div className={className}>
      <UserInfo />
      {canView ? (
        <NavigationBar
          items={tabs}
          className={cn("w-full", "border-y border-border")}
        />
      ) : null}
    </div>
  );
}

export function ProfileZoneSkeleton() {
  const tabs: NavItem[] = [
    {
      id: "posts",
      label: "Posts",
      icon: <TableOfContents className="size-4" />,
    },
    {
      id: "media",
      label: "Media",
      icon: <ImageIcon className="size-4" />,
    },
  ];

  return (
    <div className={cn("w-full relative", "flex flex-col items-center")}>
      <Header className="w-full" />
      <UserInfoSkeleton />
      <NavigationBar
        items={tabs}
        className={cn("w-full", "border-y border-border")}
      />
    </div>
  );
}
