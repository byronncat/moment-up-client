import type { UserSummaryDto } from "api";

import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/route";

import Link from "next/link";
import { UserInfoCard } from "../../common";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card";

type HoverableComponentProps = Readonly<{
  userInfo: UserSummaryDto;
  onFollow: (event: React.MouseEvent) => Promise<void>;
  children: React.ReactNode;
}>;

export default function HoverableComponent({
  children,
  userInfo,
  onFollow,
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
        <UserInfoCard user={userInfo} onFollow={onFollow} />
      </HoverCardContent>
    </HoverCard>
  );
}
