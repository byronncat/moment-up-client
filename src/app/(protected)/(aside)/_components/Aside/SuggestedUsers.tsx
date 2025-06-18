"use client";

import type { API, UserCardDisplayInfo } from "api";

import { useRouter } from "next/navigation";
import { useState, use } from "react";
import { UserApi } from "@/services";
import { ROUTE } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar, UserInfoCard } from "@/components";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import SectionHeader from "./SectionHeader";
import { CircleCheck } from "@/components/icons";

export default function SuggestedSection({
  initialRes,
}: Readonly<{
  initialRes: Promise<API<UserCardDisplayInfo[]>>;
}>) {
  const response = use(initialRes);
  const suggestedUsers = response?.data ?? [];

  if (suggestedUsers?.length === 0) return null;
  return (
    <div className="w-full">
      <SectionHeader className="mb-4">Suggested for you</SectionHeader>
      <div>
        {suggestedUsers?.map((user) => (
          <SuggestedUserItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function SuggestedUserItem({
  user,
}: Readonly<{
  user: UserCardDisplayInfo;
}>) {
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();

  async function followHandler(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isFollowing) await UserApi.toggleFollow(user.id);
    else await UserApi.toggleFollow(user.id);
    setIsFollowing((prev) => !prev);
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "p-2 rounded-md",
        "hover:bg-accent/[.05] cursor-pointer",
        "transition-colors duration-150 ease-in-out"
      )}
      onClick={() => {
        router.push(ROUTE.PROFILE(user.username));
      }}
    >
      <div
        className="flex items-center gap-2"
        onClick={(e) => e.preventDefault()}
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            <Link
              href={ROUTE.PROFILE(user.username)}
              className="hover:opacity-80 transition-opacity duration-150 ease-in-out"
            >
              <Avatar
                src={user.avatar}
                alt={`${user.displayName}'s avatar`}
                size="10"
              />
            </Link>
          </HoverCardTrigger>
          <HoverCardContent className="w-[288px]">
            <UserInfoCard user={user} onFollow={followHandler} />
          </HoverCardContent>
        </HoverCard>
        <div className="flex flex-col">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link href={ROUTE.PROFILE(user.username)}>
                <div
                  className={cn(
                    "text-sm font-semibold",
                    "hover:opacity-80",
                    "transition-opacity duration-150 ease-in-out",
                    "flex items-center gap-1.5"
                  )}
                >
                  {user.username}
                  {user.verified && (
                    <CircleCheck className="size-3 fill-primary" />
                  )}
                </div>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-[288px]">
              <UserInfoCard user={user} onFollow={followHandler} />
            </HoverCardContent>
          </HoverCard>
          <span className="text-xs text-muted-foreground">
            {user.followedBy
              ? `Followed by ${user.followedBy.displayItems[0].displayName}`
              : `Popular user`}
          </span>
        </div>
      </div>
      <FollowText isFollowing={isFollowing} followHandler={followHandler} />
    </div>
  );
}

function FollowText({
  isFollowing,
  followHandler,
}: Readonly<{
  isFollowing: boolean;
  followHandler: (e: React.MouseEvent) => void;
}>) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      className={cn(
        "text-xs font-semibold",
        isFollowing && isHovering ? "text-red-400" : "text-primary",
        "cursor-pointer hover:opacity-80",
        "transition-opacity duration-150 ease-in-out"
      )}
      onClick={followHandler}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isFollowing ? (isHovering ? "Unfollow" : "Following") : "Follow"}
    </button>
  );
}
