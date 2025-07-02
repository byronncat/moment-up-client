"use client";

import type { UserCardDisplayInfo } from "api";

import { useRef } from "react";
import { useHover } from "usehooks-ts";
import format from "@/utilities/format";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
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
import { Circle, User, Settings } from "@/components/icons";
import { useAuth } from "../providers";

type UserInfoCardProps = Readonly<{
  user: UserCardDisplayInfo;
  onFollow?: (e: React.MouseEvent) => Promise<void>;
}>;

export default function UserInfoCard({ user, onFollow }: UserInfoCardProps) {
  const { user: currentUser } = useAuth();
  const isCurrentUser = currentUser?.id === user.id;

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
              <span className="truncate max-w-[144px]">{user.displayName}</span>
              {user.verified && (
                <Circle variant="check" className="size-3 fill-primary" />
              )}
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
              className={cn("leading-5", "truncate max-w-[144px]")}
            >
              @{user.username}
            </CardDescription>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <p className="text-sm wrap-break-word">{user.bio}</p>
        <FollowSection following={user.following} followers={user.followers} />
        {!isCurrentUser && user.followedBy && (
          <FollowedBy users={user.followedBy} />
        )}
      </CardContent>
      <CardFooter className="p-0 mt-4">
        {isCurrentUser ? (
          <EditProfileButton />
        ) : (
          <FollowButton
            isFollowing={user.isFollowing}
            followHandler={onFollow}
          />
        )}
      </CardFooter>
    </div>
  );
}

type FollowSectionProps = Readonly<{
  following: UserCardDisplayInfo["following"];
  followers: UserCardDisplayInfo["followers"];
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

const MAX_FOLLOWED_BY_DISPLAY = 3;
function FollowedBy({
  users,
}: Readonly<{
  users: UserCardDisplayInfo["followedBy"];
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
            ? "max-w-[186px]"
            : users.displayItems.length === 2
              ? "max-w-[202px]"
              : "max-w-[218px]"
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

type FollowButtonProps = Readonly<{
  isFollowing?: boolean;
  followHandler?: (e: React.MouseEvent) => Promise<void>;
}>;

function FollowButton({ isFollowing, followHandler }: FollowButtonProps) {
  const hoverRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(hoverRef as React.RefObject<HTMLElement>);

  const handleClick = async (e: React.MouseEvent) => {
    if (!followHandler) return;
    await followHandler(e);
  };

  const renderIcon = () => {
    if (isFollowing)
      return isHover ? <User variant="minus" /> : <User variant="check" />;
    return <User variant="plus" />;
  };

  return (
    <Button
      variant={isFollowing ? (isHover ? "destructive" : "default") : "outline"}
      className="text-sm w-full [&_svg]:size-4"
      onClick={handleClick}
      ref={hoverRef}
    >
      {renderIcon()}
      {isFollowing ? (isHover ? "Unfollow" : "Following") : "Follow"}
    </Button>
  );
}

function EditProfileButton() {
  const handleClick = async () => {
    console.log("Edit Profile");
  };

  return (
    <Button
      variant="outline"
      className="text-sm w-full [&_svg]:size-4"
      onClick={handleClick}
    >
      <Settings />
      Edit Profile
    </Button>
  );
}
