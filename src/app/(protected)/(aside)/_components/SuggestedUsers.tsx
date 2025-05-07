"use client";

import type { UserInfo } from "api";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SuggestingApi, UserApi } from "@/services";
import { ROUTE } from "@/constants/clientConfig";

import { Avatar, UserInfoCard } from "@/components";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleCheck } from "@/components/icons";
import SectionHeader from "./SectionHeader";

export default function SuggestedSection() {
  const [suggestedUsers, setSuggestedUsers] = useState<UserInfo[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuggestedUsers() {
      const res = await SuggestingApi.getSuggestedUsers();
      if (res.success) setSuggestedUsers(res.data ?? []);
      setLoading(false);
    }
    fetchSuggestedUsers();
  }, []);

  return (
    <div className="w-full">
      <SectionHeader className="mb-4" loading={loading}>
        Suggested for you
      </SectionHeader>
      <div>
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <SkeletonUserItem key={index} />
            ))
          : suggestedUsers?.map((user) => (
              <SuggestedUserItem key={user.id} user={user} />
            ))}
      </div>
    </div>
  );
}

function SkeletonUserItem() {
  return (
    <div className={cn("flex items-center justify-between", "p-2")}>
      <div className="flex items-center gap-2">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-4 w-12" />
    </div>
  );
}

type SuggestedUserItemProps = ComponentProps<{
  user: UserInfo;
}>;

function SuggestedUserItem({ user }: SuggestedUserItemProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();

  function followHandler(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isFollowing) UserApi.unfollowUser(user.id);
    else UserApi.followUser(user.id);
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
      onClick={(e) => {
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
          <HoverCardContent className="w-[18rem]">
            <UserInfoCard
              user={user}
              isFollowing={isFollowing}
              onFollow={followHandler}
            />
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
            <HoverCardContent className="w-[18rem]">
              <UserInfoCard
                user={user}
                isFollowing={isFollowing}
                onFollow={followHandler}
              />
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

type FollowTextProps = ComponentProps<{
  isFollowing: boolean;
  followHandler: (e: React.MouseEvent) => void;
}>;

function FollowText({ isFollowing, followHandler }: FollowTextProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      className={cn(
        "text-xs font-semibold",
        isFollowing && isHovering ? "text-red-400" : "text-primary",
        "cursor-pointer hover:opacity-80",
        "transition-opacity duration-150 ease-in-out"
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        followHandler(e);
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isFollowing ? (isHovering ? "Unfollow" : "Following") : "Follow"}
    </button>
  );
}
