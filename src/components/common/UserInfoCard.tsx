"use client";

import type { UserCardInfo } from "api";

import { useState } from "react";
import { cn } from "@/libraries/utils";
import format from "@/utilities/format";
import { ROUTE } from "@/constants/clientConfig";

import Link from "next/link";
import Avatar from "./Avatar";
import { Button } from "../ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CircleCheck } from "../icons";
import { UserMinus, UserPlus, UserCheck } from "lucide-react";

type UserInfoCardProps = Readonly<{
  user: UserCardInfo;
  isFollowing?: boolean;
  onFollow?: (e: React.MouseEvent) => void;
}>;

export default function UserInfoCard({
  user,
  isFollowing,
  onFollow,
}: UserInfoCardProps) {
  return (
    <div className="size-full">
      <CardHeader className={cn("p-0", "flex-row gap-3", "space-y-0")}>
        <Link
          href={ROUTE.PROFILE(user.username)}
          className="hover:opacity-80 transition-opacity duration-150 ease-in-out"
        >
          <Avatar
            src={user.avatar}
            alt={`${user.displayName}'s avatar`}
            size="14"
          />
        </Link>
        <div>
          <Link
            href={ROUTE.PROFILE(user.username)}
            className={cn(
              "hover:opacity-80",
              "transition-opacity duration-150 ease-in-out"
            )}
          >
            <CardTitle
              className={cn(
                "mb-0",
                "text-base/tight",
                "flex items-center gap-1.5"
              )}
            >
              <span className="truncate max-w-[9rem]">{user.displayName}</span>
              {user.verified && <CircleCheck className="size-3 fill-primary" />}
            </CardTitle>
          </Link>
          <Link
            href={ROUTE.PROFILE(user.username)}
            className={cn(
              "hover:opacity-80",
              "transition-opacity duration-150 ease-in-out"
            )}
          >
            <CardDescription
              className={cn("leading-5", "truncate max-w-[9rem]")}
            >
              @{user.username}
            </CardDescription>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <p className="text-sm wrap-break-word">{user.bio}</p>
        <FollowSection following={user.following} followers={user.followers} />
        {user.followedBy && <FollowedBy users={user.followedBy} />}
      </CardContent>
      <CardFooter className="p-0 mt-4">
        <FollowButton isFollowing={isFollowing} followHandler={onFollow} />
      </CardFooter>
    </div>
  );
}

function FollowButton({
  isFollowing,
  followHandler,
}: Readonly<{
  isFollowing?: boolean;
  followHandler?: (e: React.MouseEvent) => void;
}>) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <Button
      variant={
        isFollowing ? (isHovering ? "destructive" : "default") : "outline"
      }
      className="text-sm w-full"
      onClick={followHandler}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isFollowing ? isHovering ? <UserMinus /> : <UserCheck /> : <UserPlus />}
      {isFollowing ? (isHovering ? "Unfollow" : "Following") : "Follow"}
    </Button>
  );
}

function FollowSection({
  following,
  followers,
}: Readonly<{
  following: UserCardInfo["following"];
  followers: UserCardInfo["followers"];
}>) {
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

const MAX_FOLLOWED_BY_DISPLAY = 3;
function FollowedBy({
  users,
}: Readonly<{
  users: UserCardInfo["followedBy"];
}>) {
  if (!users) return null;
  const DisplayUsers = users.displayItems;
  return (
    <div className={cn("flex items-top gap-2", "mt-4")}>
      <div className={cn("flex flex-row-reverse", "w-fit")}>
        {DisplayUsers.reverse().map((user, index) => (
          <Avatar
            key={user.id}
            src={user.avatar}
            alt={`${user.displayName}'s avatar`}
            size="7"
            className={cn(
              index !== DisplayUsers.length - 1 && "-ml-3",
              "border-2 border-card"
            )}
          />
        ))}
      </div>
      <div
        className={cn(
          "text-xs text-muted-foreground",
          "mt-0.5",
          "wrap-break-word",
          users.displayItems.length === 3
            ? "max-w-[11.625rem]"
            : users.displayItems.length === 2
              ? "max-w-[12.625rem]"
              : "max-w-[13.625rem]"
        )}
      >
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
