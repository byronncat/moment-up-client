import type { UserProfileInfo } from "api";
import { ROUTE } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import UserInfo, { UserInfoSkeleton } from "./UserInfo";
import { NavigationBar, type NavItem } from "@/components/common";
import { TableOfContents, Image, Tag } from "@/components/icons";

type ProfileZoneProps = Readonly<{
  data: UserProfileInfo;
  className?: string;
}>;

export default function ProfileZone({ data, className }: ProfileZoneProps) {
  const tabs: NavItem[] = [
    {
      id: "moments",
      label: "Moments",
      icon: <TableOfContents className="size-4" />,
      href: ROUTE.PROFILE(data.username),
    },
    {
      id: "media",
      label: "Media",
      icon: <Image aria-label="User's media" className="size-4" />,
      href: ROUTE.PROFILE(data.username, "media"),
    },
    {
      id: "tagged",
      label: "Tagged",
      icon: <Tag className="size-4" />,
      href: ROUTE.PROFILE(data.username, "tagged"),
    },
  ];

  return (
    <div className={className}>
      <UserInfo data={data} />
      <NavigationBar
        items={tabs}
        className={cn("w-full", "border-y border-border")}
      />
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
      icon: <Image aria-label="User's media" className="size-4" />,
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
