import type { UserCardInfo } from "api";

import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/clientConfig";

import Link from "next/link";
import { UserInfoCard } from "../../common";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card";

type HoverableComponentProps = ComponentProps<{
  userInfo: UserCardInfo;
  isFollowing: boolean;
  followHandler: (e: React.MouseEvent) => void;
}>;

export default function HoverableComponent({
  children,
  userInfo,
  isFollowing,
  followHandler,
}: HoverableComponentProps) {
  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn(
          "inline-flex",
          "hover:opacity-80 transition-opacity duration-150 ease-in-out"
        )}
        asChild
      >
        <Link href={ROUTE.PROFILE(userInfo.username)}>{children}</Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-[288px]">
        <UserInfoCard
          user={userInfo}
          isFollowing={isFollowing}
          onFollow={followHandler}
        />
      </HoverCardContent>
    </HoverCard>
  );
}
