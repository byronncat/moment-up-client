import type { UserProfileInfo } from "api";
import { ROUTE } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import UserInfo from "./UserInfo";
import { NavigationBar, type NavItem } from "@/components";
import { TableOfContents, Image, Tag } from "lucide-react";

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
