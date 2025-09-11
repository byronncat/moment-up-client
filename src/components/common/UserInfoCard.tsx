"use client";

import type { AccountDto, UserSummaryDto } from "api";

import { useRef } from "react";
import { useHover } from "usehooks-ts";
import { useAuth } from "../providers";
import Format from "@/utilities/format";
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
import { Settings, User } from "@/components/icons";

type UserInfoCardProps = Readonly<{
  user: UserSummaryDto;
  onFollow?: (event: React.MouseEvent) => Promise<void>;
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
            alt={`${user.displayName ?? user.username}'s avatar`}
            size="14"
          />
        </Link>

        <div className="min-w-0">
          <Link
            href={ROUTE.PROFILE(user.username)}
            className={cn(
              "hover:opacity-80",
              "transition-opacity duration-150 ease-in-out"
            )}
          >
            <CardTitle className="mb-0 text-base/tight truncate">
              {user.displayName ?? user.username}
            </CardTitle>
          </Link>

          <Link
            href={ROUTE.PROFILE(user.username)}
            className={cn(
              "hover:opacity-80",
              "transition-opacity duration-150 ease-in-out"
            )}
          >
            <CardDescription className="leading-5 truncate">
              @{user.username}
            </CardDescription>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-0 mt-4">
        <p className="text-sm wrap-break-word">{user.bio}</p>
        <FollowSection
          following={user.following}
          followers={user.followers}
          className="mt-3"
        />
        {!isCurrentUser && user.followedBy ? (
          <FollowedBy users={user.followedBy} />
        ) : null}
      </CardContent>

      <CardFooter className="p-0 mt-4">
        {isCurrentUser ? (
          <EditProfileButton />
        ) : (
          <FollowButton isFollowing={user.isFollowing} onFollow={onFollow} />
        )}
      </CardFooter>
    </div>
  );
}

type FollowSectionProps = Readonly<{
  following: UserSummaryDto["following"];
  followers: UserSummaryDto["followers"];
  className?: string;
}>;

function FollowSection({
  following,
  followers,
  className,
}: FollowSectionProps) {
  return (
    <div className={cn("flex gap-3", "text-sm", className)}>
      <div className="flex items-center gap-1">
        <span className="font-semibold">{Format.number(following)}</span>
        <span className="text-muted-foreground">following</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-semibold">{Format.number(followers)}</span>
        <span className="text-muted-foreground">followers</span>
      </div>
    </div>
  );
}

const MAX_FOLLOWED_BY_DISPLAY = 3;

type FollowedByUser = {
  id: string;
  displayName: string;
  avatar: AccountDto["avatar"];
};

const getFollowedByMessage = (
  displayItems: FollowedByUser[],
  totalCount: number
) => {
  const names = displayItems
    .map((user: FollowedByUser) => user.displayName)
    .join(", ");
  const additionalCount = totalCount - MAX_FOLLOWED_BY_DISPLAY;
  const additionalText =
    additionalCount > 0 ? ` and ${additionalCount} others you follow` : "";

  return `Followed by ${names}${additionalText}`;
};

const getMaxWidthClass = (itemCount: number) => {
  switch (itemCount) {
    case 3:
      return "max-w-[186px]";
    case 2:
      return "max-w-[202px]";
    default:
      return "max-w-[218px]";
  }
};

function FollowedBy({
  users,
}: Readonly<{
  users: UserSummaryDto["followedBy"];
}>) {
  if (!users) return null;

  const { displayItems } = users;
  const reversedItems = [...displayItems].reverse();

  return (
    <div className={cn("flex items-top gap-2", "mt-4")}>
      <div className={cn("flex flex-row-reverse", "w-fit")}>
        {reversedItems.map((user, index) => (
          <Avatar
            key={user.id}
            src={user.avatar}
            alt={`${user.displayName}'s avatar`}
            size="7"
            className={cn(
              index !== reversedItems.length - 1 && "-ml-3",
              "border-2 border-card"
            )}
          />
        ))}
      </div>
      <div
        className={cn(
          "text-xs text-muted-foreground",
          "mt-0.5 wrap-break-word",
          getMaxWidthClass(displayItems.length)
        )}
      >
        {getFollowedByMessage(displayItems, users.count)}
      </div>
    </div>
  );
}

type FollowButtonProps = Readonly<{
  isFollowing?: boolean;
  onFollow?: (event: React.MouseEvent) => Promise<void>;
}>;

function FollowButton({ isFollowing, onFollow }: FollowButtonProps) {
  const hoverRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(hoverRef as React.RefObject<HTMLElement>);

  const handleClick = async (event: React.MouseEvent) => {
    if (!onFollow) return;
    await onFollow(event);
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
  const handleClick = () => {
    // TODO: Implement edit profile
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
