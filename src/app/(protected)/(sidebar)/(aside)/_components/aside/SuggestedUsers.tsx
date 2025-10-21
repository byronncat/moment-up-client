"use client";

import type { UserSummaryDto } from "api";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useHover } from "usehooks-ts";
import { useAuth, useRefreshApi } from "@/components/providers";
import useSWRImmutable from "swr/immutable";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { toast } from "sonner";
import { ApiUrl, UserApi } from "@/services";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar, UserInfoCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import SectionHeader from "./SectionHeader";

export default function SuggestedUsers() {
  const { token } = useAuth();
  const { data, isLoading, error, mutate } = useSWRImmutable(
    [ApiUrl.suggestion.users, token.accessToken],
    ([url, token]) =>
      SWRFetcherWithToken<{
        users: UserSummaryDto[];
      }>(url, token)
  );

  const follow = useRefreshApi(UserApi.follow);
  async function handleFollow(userId: string, shouldFollow: boolean) {
    if (!data) return;

    const prev = data;
    mutate(
      {
        users: data.users.map((u) =>
          u.id === userId ? { ...u, isFollowing: shouldFollow } : u
        ),
      },
      { revalidate: false }
    );

    const { success, message } = await follow({
      targetId: userId,
      shouldFollow,
    });

    if (!success) {
      mutate(prev, { revalidate: false });
      toast.error(
        message ||
          `Unable to ${shouldFollow ? "follow" : "unfollow"} user. Try again later.`
      );
    }
  }

  if (isLoading) return <SuggestedUsersSkeleton />;
  if (!data || data.users.length === 0 || error) return null;
  return (
    <div className="w-full">
      <SectionHeader className="mb-4">Suggested for you</SectionHeader>
      <div className="w-[calc(100%-4px)] mx-auto">
        {data.users.map((user) => (
          <SuggestedUserItem
            key={user.id}
            user={user}
            onFollow={(event) => {
              event.preventDefault();
              event.stopPropagation();
              return handleFollow(user.id, !user.isFollowing);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SuggestedUserItem({
  user,
  onFollow,
}: Readonly<{
  user: UserSummaryDto;
  onFollow: (event: React.MouseEvent) => Promise<void>;
}>) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleFollow(event: React.MouseEvent) {
    if (isLoading) return;
    setIsLoading(true);
    await onFollow(event);
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
        "hover:bg-accent/5 cursor-pointer",
        "transition-colors duration-150 ease-in-out"
      )}
      onClick={handleClick}
    >
      <UserHoverCard user={user} onFollow={handleFollow}>
        <Link
          href={ROUTE.PROFILE(user.username)}
          className="hover:opacity-80 transition-opacity duration-150 ease-in-out"
          tabIndex={-1}
        >
          <Avatar
            src={user.avatar}
            alt={`${user.displayName ?? user.username}'s avatar`}
            size="10"
            ring
            showRing={user.hasStory}
          />
        </Link>
      </UserHoverCard>

      <div className={cn("flex flex-col", "min-w-0 w-full ml-2.5 mr-3")}>
        <UserHoverCard user={user} onFollow={handleFollow}>
          <Link
            href={ROUTE.PROFILE(user.username)}
            className={cn(
              "text-sm font-semibold",
              "truncate",
              "hover:underline focus:underline outline-none"
            )}
          >
            {user.username}
          </Link>
        </UserHoverCard>

        <span className={cn("text-xs text-muted-foreground", "truncate")}>
          {user.followedBy
            ? `Followed by ${user.followedBy.displayItems[0].displayName}`
            : `Suggested for you`}
        </span>
      </div>

      <FollowButton
        isFollowing={!!user.isFollowing}
        onFollow={handleFollow}
        className="flex-shrink-0"
      />
    </div>
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

type UserHoverCardProps = Readonly<{
  children?: React.ReactNode;
  user: UserSummaryDto;
  onFollow: (event: React.MouseEvent) => Promise<void>;
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

function SuggestedUsersSkeleton() {
  return (
    <div>
      <SectionHeader className="mb-4">Suggested for you</SectionHeader>
      <div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            className={cn("flex items-center justify-between", "p-2")}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
          >
            <div className="flex items-center gap-2.5">
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
