import { __parseUrl } from "@/__mocks__";
import type { UserSummaryDto } from "api";

import { useRefreshApi } from "@/components/providers";
import { toast } from "sonner";
import { UserApi } from "@/services";
import { Format } from "@/utilities";

import { cn } from "@/libraries/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, UserInfoCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { User } from "@/components/icons";

type FollowRequestProps = {
  user: UserSummaryDto;
  createdAt: string;
  onClick: () => void;
};

export default function FollowRequestContent({
  user,
  createdAt,
  onClick,
}: FollowRequestProps) {
  const acceptFollowRequestApi = useRefreshApi(UserApi.acceptFollowRequest);
  async function handleAccept() {
    const { success, message } = await acceptFollowRequestApi(user.id);
    if (success) onClick();
    else toast.error(message || "Failed to accept follow request");
  }

  const declineFollowRequestApi = useRefreshApi(UserApi.declineFollowRequest);
  async function handleDecline() {
    const { success, message } = await declineFollowRequestApi(user.id);
    if (success) onClick();
    else toast.error(message || "Failed to decline follow request");
  }

  return (
    <>
      <UserHoverCard user={user} className="mr-3">
        {/* Outer div to fix ref when using hover card */}
        <div>
          <Avatar src={__parseUrl(user.avatar, "image", 48)} size="12" />
        </div>
      </UserHoverCard>
      <div className={cn("grow", "min-w-0")}>
        <div className={cn("min-w-0 flex", "text-sm")}>
          <UserHoverCard user={user}>
            <span className="font-semibold truncate">
              {user.displayName ?? user.username} Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </span>
          </UserHoverCard>
          <span className="inline-block min-w-fit ml-1">
            requested to follow you.
          </span>
        </div>
        <div className={cn("flex items-center gap-2", "mt-2")}>
          <Button variant="outline" size="sm" onClick={handleAccept}>
            <User variant="plus" className="size-4" />
            Accept
          </Button>
          <Button variant="outline" size="sm" onClick={handleDecline}>
            <User variant="x" className="size-4" />
            Decline
          </Button>
        </div>
      </div>
      <span className={cn("mt-3 ml-3", "text-xs text-muted-foreground")}>
        {Format.relativeTime(createdAt)}
      </span>
    </>
  );
}

type UserHoverCardProps = Readonly<{
  children?: React.ReactNode;
  user: UserSummaryDto;
  className?: string;
}>;

function UserHoverCard({ children, user, className }: UserHoverCardProps) {
  function handleFollow() {
    console.log("follow");
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild className={cn("cursor-pointer", className)}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-[300px]" side="top">
        <UserInfoCard user={user} onFollow={handleFollow} />
      </HoverCardContent>
    </HoverCard>
  );
}
