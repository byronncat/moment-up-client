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
  align?: "center" | "start" | "end";
  onFollow: (event: React.MouseEvent) => Promise<void>;
  className?: string;
  tabIndex?: number;
}>;

export default function HoverableComponent({
  children,
  userInfo,
  align = "center",
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
      <HoverCardContent className="w-[288px]" align={align}>
        <UserInfoCard user={userInfo} onFollow={onFollow} />
      </HoverCardContent>
    </HoverCard>
  );
}
