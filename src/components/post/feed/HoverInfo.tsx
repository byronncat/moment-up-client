import type { UserSummaryDto } from "api";

import Link from "next/link";
import { UserInfoCard } from "../../common";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card";
import { ROUTE } from "@/constants/route";

type HoverableComponentProps = Readonly<{
  children: React.ReactNode;
  userInfo: UserSummaryDto;
  onFollow: (event: React.MouseEvent) => Promise<void>;
  className?: string;
  tabIndex?: number;
}>;

export default function HoverableComponent({
  children,
  userInfo,
  onFollow,
  className,
  ...props
}: HoverableComponentProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={ROUTE.PROFILE(userInfo.username)}
          className={className}
          {...props}
        >
          {children}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-[288px]">
        <UserInfoCard user={userInfo} onFollow={onFollow} />
      </HoverCardContent>
    </HoverCard>
  );
}
