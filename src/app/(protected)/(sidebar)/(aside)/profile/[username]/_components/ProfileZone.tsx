import type { ProfileDto } from "api";

import { useAuth } from "@/components/providers/Auth";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import UserInfo, { UserInfoSkeleton } from "./UserInfo";
import { type NavItem, NavigationBar } from "@/components/common";
import { Image as ImageIcon, TableOfContents, Tag } from "@/components/icons";

type ProfileZoneProps = Readonly<{
  data: ProfileDto;
  className?: string;
}>;

export const PROFILE_ZONE_HEIGHT = 418;
export default function ProfileZone({ data, className }: ProfileZoneProps) {
  const { user } = useAuth();
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
      icon: <ImageIcon className="size-4" />,
      href: user ? ROUTE.PROFILE(data.username, "media") : ROUTE.LOGIN,
    },
    {
      id: "tagged",
      label: "Tagged",
      icon: <Tag className="size-4" />,
      href: user ? ROUTE.PROFILE(data.username, "tagged") : ROUTE.LOGIN,
    },
  ];

  return (
    <div className={className}>
      <UserInfo data={data} />
      {data.isProtected ? null : (
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
