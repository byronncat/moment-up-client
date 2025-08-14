import type { CommentInfo } from "api";

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
  data: CommentInfo["user"];
  children: React.ReactNode;
  className?: string;
}>;

export default function HoverUserCard({
  data,
  children,
  className,
}: HoverUserCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn(
          "inline-flex",
          "hover:opacity-80 transition-opacity duration-150 ease-in-out",
          className
        )}
        asChild
      >
        <Link
          href={ROUTE.PROFILE(data.username)}
          className={cn("min-w-0", className)}
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
