"use client";

import type { UserSummaryDto } from "api";

import { useRef } from "react";
import { useHover } from "usehooks-ts";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar, UserInfoCard } from "@/components/common";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

type UserItemProps = Readonly<{
  data: UserSummaryDto;
  onFollow: () => void;
}>;

export default function UserItem({ data, onFollow }: UserItemProps) {
  function handleFollow(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    onFollow();
  }

  return (
    <Link
      href={ROUTE.PROFILE(data.username)}
      className={cn(
        "flex px-4 py-3",
        "hover:bg-accent/[.05] cursor-pointer",
        "transition-colors duration-150 ease-in-out"
      )}
      tabIndex={-1}
    >
      <UserHoverCard user={data} onFollow={handleFollow}>
        <Avatar
          src={data.avatar}
          alt={`${data.displayName ?? data.username}'s avatar`}
          size="10"
          ring
          showRing={data.hasStory}
          className="hover:opacity-80 transition-opacity duration-150 ease-in-out"
        />
      </UserHoverCard>

      <div className={cn("flex flex-col", "min-w-0 w-full", "ml-2.5")}>
        <div className="flex justify-between">
          <div className={cn("flex flex-col", "min-w-0", "w-full mr-4")}>
            <UserHoverCard user={data} onFollow={handleFollow}>
              <span
                className={cn(
                  "text-sm font-semibold",
                  "truncate",
                  "hover:underline",
                  "focus:underline outline-none"
                )}
                tabIndex={0}
                onKeyDown={(element) => {
                  if (element.key === "Enter" || element.key === " ") {
                    element.preventDefault();
                    element.currentTarget.click();
                  }
                }}
              >
                {data.displayName ?? data.username}
              </span>
            </UserHoverCard>

            <span className={cn("text-sm text-muted-foreground", "truncate")}>
              @{data.username}
            </span>
          </div>

          <FollowButton
            isFollowing={!!data.isFollowing}
            onFollow={handleFollow}
            className="flex-shrink-0 my-1"
          />
        </div>

        {data.bio ? <p className="text-sm mt-1.5">{data.bio}</p> : null}
      </div>
    </Link>
  );
}

type UserHoverCardProps = Readonly<{
  children?: React.ReactNode;
  user: UserSummaryDto;
  onFollow: (event: React.MouseEvent) => void;
  className?: string;
}>;

export function UserHoverCard({
  children,
  user,
  onFollow,
  className,
}: UserHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild className={cn("cursor-pointer", className)}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-[300px]" side="top">
        <UserInfoCard user={user} onFollow={onFollow} />
      </HoverCardContent>
    </HoverCard>
  );
}

type FollowTextProps = Readonly<{
  isFollowing: boolean;
  onFollow: (event: React.MouseEvent) => void;
  className?: string;
}>;

export function FollowButton({
  isFollowing,
  onFollow,
  className,
}: FollowTextProps) {
  const hoverRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(hoverRef as React.RefObject<HTMLElement>);

  return (
    <Button
      ref={hoverRef}
      size="sm"
      variant={isFollowing ? (isHover ? "destructive" : "outline") : "default"}
      onClick={onFollow}
      className={cn("w-[88px] cursor-pointer", className)}
    >
      {isFollowing ? (isHover ? "Unfollow" : "Following") : "Follow"}
    </Button>
  );
}
