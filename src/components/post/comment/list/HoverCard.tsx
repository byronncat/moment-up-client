import type { CommentDto } from "api";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { UserInfoCard } from "@/components/common";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ROUTE } from "@/constants/route";

type HoverUserCardProps = Readonly<{
  data: CommentDto["user"];
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}>;

export default function HoverUserCard({
  data,
  children,
  className,
  ...props
}: HoverUserCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={ROUTE.PROFILE(data.username)}
          className={cn("min-w-0", className)}
          {...props}
        >
          {children}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-[288px]">
        <UserInfoCard user={data} />
      </HoverCardContent>
    </HoverCard>
  );
}
