"use client";

import type { UserCardDisplayInfo } from "api";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useHover } from "usehooks-ts";
import { useAuth, useRefreshApi } from "@/components/providers";
import useSWRImmutable from "swr/immutable";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { toast } from "sonner";
import { ApiUrl, UserApi } from "@/services";
import { ROUTE } from "@/constants/route";
import { FIRST } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar, UserInfoCard } from "@/components/common";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import SectionHeader, { HeaderSkeleton } from "./SectionHeader";

export default function SuggestedUsers() {
  const { token } = useAuth();
  const { data, isLoading, error } = useSWRImmutable(
    [ApiUrl.suggestion.users, token.accessToken],
    ([url, token]) =>
      SWRFetcherWithToken<{
        users: UserCardDisplayInfo[];
      }>(url, token)
  );

  if (isLoading) return <SuggestedUsersSkeleton />;
  if (!data || data.users.length === 0 || error) return null;
  return (
    <div className="w-full">
      <SectionHeader className="mb-4">Suggested for you</SectionHeader>
      <div>
        {data.users.map((user) => (
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isFollowing = user.isFollowing || false;

  const follow = useRefreshApi(UserApi.follow);
  async function handleFollow(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (isLoading) return;
    setIsLoading(true);
    setUser((prev) => ({ ...prev, isFollowing: !isFollowing }));
    const { success, message } = await follow({
      targetId: user.id,
      shouldFollow: !isFollowing,
    });
    if (!success) {
      setUser((prev) => ({ ...prev, isFollowing }));
      toast.error(message || "Failed to follow/unfollow user");
    }
    setIsLoading(false);
  }

  function handleClick(event: React.MouseEvent) {
    if (event.target !== event.currentTarget) return;
    router.push(ROUTE.PROFILE(user.username));
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "p-2 rounded-md",
        "hover:bg-accent/[.05] cursor-pointer",
        "transition-colors duration-150 ease-in-out"
      )}
      onClick={handleClick}
    >
      <div
        className="flex items-center gap-2"
        onClick={(event) => event.preventDefault()}
      >
        <UserHoverCard user={user} onFollow={handleFollow}>
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
          <UserHoverCard user={user} onFollow={handleFollow}>
            <Link href={ROUTE.PROFILE(user.username)}>
              <div
                className={cn(
                  "text-sm font-semibold",
                  "hover:opacity-80",
                  "transition-opacity duration-150 ease-in-out",
                  "flex items-center gap-1.5",
                  "truncate max-w-[172px]"
                )}
              >
                {user.username}
              </div>
            </Link>
          </UserHoverCard>
          <span
            className={cn(
              "text-xs text-muted-foreground",
              "truncate max-w-[172px]"
            )}
          >
            {user.followedBy
              ? `Followed by ${user.followedBy.displayItems[FIRST].displayName}`
              : `Popular user`}
          </span>
        </div>
      </div>

      <FollowButton isFollowing={isFollowing} onFollow={handleFollow} />
    </div>
  );
}

type FollowTextProps = Readonly<{
  isFollowing: boolean;
  onFollow: (event: React.MouseEvent) => void;
}>;

export function FollowButton({ isFollowing, onFollow }: FollowTextProps) {
  const hoverRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(hoverRef as React.RefObject<HTMLElement>);
  return (
    <button
      ref={hoverRef}
      onClick={onFollow}
      className={cn(
        "w-[72px] text-left",
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
  onFollow: (event: React.MouseEvent) => Promise<void>;
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

function SuggestedUsersSkeleton() {
  return (
    <div>
      <HeaderSkeleton className="mb-5" />
      <div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            className={cn("flex items-center justify-between", "p-2")}
            key={index}
          >
            <div className="flex items-center gap-2">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-col gap-1 mt-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-12 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
