"use client";

import type { UserInfo } from "api";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SuggestingApi, UserApi } from "@/services";
import format from "@/helpers/format";
import { ROUTE } from "@/constants/clientConfig";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, CircleCheck } from "@/components/icons";
import { UserPlus } from "lucide-react";

export default function SuggestedSection() {
  const [suggestedUsers, setSuggestedUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await SuggestingApi.getSuggestedUsers();
        if (res.success && res.data) setSuggestedUsers(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestedUsers();
  }, []);

  return (
    <div className="w-full">
      <Header className="mb-4" />
      <div className="space-y-4">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <SkeletonUserItem key={index} />
            ))
          : suggestedUsers.map((user) => (
              <SuggestedUserItem key={user.id} user={user} />
            ))}
      </div>
    </div>
  );
}

function Header({ className }: ComponentProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <span className="text-sm font-semibold text-muted-foreground">
        Suggested for you
      </span>
      <button
        className={cn(
          "text-xs font-semibold",
          "cursor-pointer hover:opacity-60",
          "transition-opacity duration-150 ease-in-out"
        )}
      >
        See all
      </button>
    </div>
  );
}

function SkeletonUserItem() {
  return (
    <div className="flex items-center justify-between">
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
  function followHandler() {
    if (isFollowing) UserApi.unfollowUser(user.id);
    else UserApi.followUser(user.id);
    setIsFollowing((prev) => !prev);
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Link href={ROUTE.PROFILE(user.username)}>
              <Avatar className="size-10">
                <AvatarImage
                  src={user.avatar}
                  alt={user.username}
                  className="object-cover object-top"
                />
                <AvatarFallback className="bg-primary">
                  <User className="size-4 fill-card" type="solid" />
                </AvatarFallback>
              </Avatar>
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
              <Link
                href={ROUTE.PROFILE(user.username)}
                className={cn(
                  "text-sm font-semibold",
                  "hover:opacity-60",
                  "transition-opacity duration-150 ease-in-out",
                  "flex items-center gap-1.5"
                )}
              >
                {user.username}
                {user.verified && (
                  <CircleCheck className="size-3 fill-primary" />
                )}
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
      <FollowButton isFollowing={isFollowing} followHandler={followHandler} />
    </div>
  );
}

type FollowButtonProps = ComponentProps<{
  isFollowing: boolean;
  followHandler: () => void;
}>;

function FollowButton({ isFollowing, followHandler }: FollowButtonProps) {
  return (
    <button
      className={cn(
        "text-xs font-semibold text-primary",
        "cursor-pointer hover:text-primary/80",
        "transition-colors duration-150 ease-in-out"
      )}
      onClick={followHandler}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

type UserInfoCardProps = ComponentProps<{
  user: UserInfo;
  isFollowing?: boolean;
  onFollow?: () => void;
}>;

function UserInfoCard({ user, isFollowing, onFollow }: UserInfoCardProps) {
  return (
    <div className="size-full">
      <CardHeader className={cn("p-0", "flex-row gap-3", "space-y-0")}>
        <Link href={ROUTE.PROFILE(user.username)}>
          <Avatar className="size-14">
            <AvatarImage
              src={user.avatar}
              alt={user.username}
              className="object-cover object-top"
            />
            <AvatarFallback className="bg-primary">
              <User className="size-4 fill-card" type="solid" />
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <CardTitle
            className={cn("mb-0", "text-lg", "flex items-center gap-1.5")}
          >
            <Link
              href={ROUTE.PROFILE(user.username)}
              className="hover:opacity-60 transition-opacity duration-150 ease-in-out"
            >
              {user.displayName}
            </Link>
            {user.verified && <CircleCheck className="size-3 fill-primary" />}
          </CardTitle>
          <CardDescription>@{user.username}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <p className="text-sm">{user.bio}</p>
        <FollowSection following={user.following} followers={user.followers} />
        {user.followedBy && <FollowedBy users={user.followedBy} />}
      </CardContent>
      <CardFooter className="p-0 mt-4">
        <Button variant="outline" className="text-sm w-full" onClick={onFollow}>
          <UserPlus />
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </CardFooter>
    </div>
  );
}

type FollowSectionProps = ComponentProps<{
  following: UserInfo["following"];
  followers: UserInfo["followers"];
}>;

function FollowSection({ following, followers }: FollowSectionProps) {
  return (
    <div className={cn("flex gap-3", "text-sm", "mt-3")}>
      <div className="flex items-center gap-1">
        <span className="font-semibold">{format.number(following)}</span>
        <span className="text-muted-foreground">following</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-semibold">{format.number(followers)}</span>
        <span className="text-muted-foreground">followers</span>
      </div>
    </div>
  );
}

type FollowedByProps = ComponentProps<{
  users: UserInfo["followedBy"];
}>;

const MAX_FOLLOWED_BY_DISPLAY = 3;
function FollowedBy({ users }: FollowedByProps) {
  if (!users) return null;
  const DisplayUsers = users.displayItems;
  return (
    <div className={cn("flex items-top gap-2", "mt-4")}>
      <div className={cn("flex flex-row-reverse", "w-fit")}>
        {DisplayUsers.reverse().map((user, index) => (
          <Avatar
            className={cn(
              "size-7",
              index !== DisplayUsers.length - 1 && "-ml-3",
              "border-2 border-card"
            )}
            key={user.id}
          >
            <AvatarImage
              src={user.avatar}
              alt={user.displayName}
              className="object-cover object-top"
            />
            <AvatarFallback className="bg-primary">
              <User className="size-4 fill-card" type="solid" />
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className={cn("text-xs text-muted-foreground", "mt-0.5")}>
        {`Followed by ${DisplayUsers.map(
          (user, index) =>
            `${user.displayName}${index !== DisplayUsers.length - 1 ? ", " : ""}`
        ).join("")} ${
          users.count > MAX_FOLLOWED_BY_DISPLAY
            ? ` and ${users.count - MAX_FOLLOWED_BY_DISPLAY} others you follow`
            : ""
        }`}
      </div>
    </div>
  );
}
