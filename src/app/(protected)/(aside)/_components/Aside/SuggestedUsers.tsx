"use client";

import type { UserCardDisplayInfo } from "api";

import { useRouter } from "next/navigation";
import { useState, use, useRef } from "react";
import { useHover } from "usehooks-ts";
import { toast } from "sonner";
import { SuggestApi, UserApi } from "@/services";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar, UserInfoCard } from "@/components/common";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import SectionHeader from "./SectionHeader";

export default function SuggestedSection({
  userPromise,
}: Readonly<{
  userPromise: ReturnType<typeof SuggestApi.getPopularUsers>;
}>) {
  const { success, data } = use(userPromise);
  const suggestedUsers = data;

  if (suggestedUsers?.length === 0 || !success) return null;
  return (
    <div className="w-full">
      <SectionHeader className="mb-4">Suggested for you</SectionHeader>
      <div>
        {suggestedUsers?.map((user) => (
          <SuggestedUserItem key={user.id} _user={user} />
        ))}
      </div>
    </div>
  );
}

function SuggestedUserItem({
  _user,
}: Readonly<{
  _user: UserCardDisplayInfo;
}>) {
  const [user, setUser] = useState(_user);
  const router = useRouter();
  const isFollowing = user.isFollowing || false;

  async function followHandler(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setUser((prev) => ({ ...prev, isFollowing: !isFollowing }));
    const { success } = await UserApi.toggleFollow(user.id);
    if (!success) {
      setUser((prev) => ({ ...prev, isFollowing }));
      toast.error("Something went wrong");
    }
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
        <UserHoverCard user={user} onFollow={followHandler}>
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
        </UserHoverCard>
        <div className="flex flex-col">
          <UserHoverCard user={user} onFollow={followHandler}>
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
              </div>
            </Link>
          </UserHoverCard>
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
  const hoverRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(hoverRef as React.RefObject<HTMLElement>);
  return (
    <button
      ref={hoverRef}
      onClick={followHandler}
      className={cn(
        "cursor-pointer",
        "text-xs font-semibold",
        isFollowing && isHover
          ? "text-red-500 dark:text-red-400"
          : "text-primary"
      )}
    >
      {isFollowing ? (isHover ? "Unfollow" : "Following") : "Follow"}
    </button>
  );
}

interface UserHoverCardProps {
  user: UserCardDisplayInfo;
  onFollow: (e: React.MouseEvent) => Promise<void>;
  children?: React.ReactNode;
}

export function UserHoverCard({
  user,
  onFollow,
  children,
}: UserHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </HoverCardTrigger>
      <HoverCardContent className="w-[288px]">
        <UserInfoCard user={user} onFollow={onFollow} />
      </HoverCardContent>
    </HoverCard>
  );
}
