"use client";

import type { UserProfileInfo } from "api";
import { useRef } from "react";
import { useHover } from "usehooks-ts";
import { useProfile } from "../_providers/ProfileProvider";
import Format from "@/utilities/format";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Settings, User } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

type UserInformationProps = Readonly<{
  data: UserProfileInfo;
}>;

export default function UserInfo({ data }: UserInformationProps) {
  const { isFollowing, follow } = useProfile();

  return (
    <div className={cn("w-full relative", "flex flex-col items-center")}>
      <div
        className={cn("w-full h-40", "-mb-15 bg-muted")}
        style={{
          backgroundImage: `url(${data.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Avatar
        src={data.avatar}
        alt={`${data.username}'s profile`}
        size="26"
        ring
        showRing={data.hasFeed}
      />

      <div className={cn("mt-3 mb-6", "flex flex-col items-center")}>
        <span className="font-semibold text-xl">{data.username}</span>
        <span className="text-muted-foreground text-sm">@{data.username}</span>
        <p className="mt-3 text-muted-foreground">{data.bio}</p>
      </div>

      <div className={cn("grid grid-cols-2 gap-10", "text-sm", "mb-6")}>
        <div className="flex flex-col items-center">
          <span className="font-bold">
            {Format.number(data.following ?? 0)}
          </span>
          <span>Following</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">
            {Format.number(data.followers ?? 0)}
          </span>
          <span>Followers</span>
        </div>
      </div>

      <div className="flex gap-2 absolute top-42 right-2">
        <FollowButton isFollowing={isFollowing} followHandler={follow} />
        <Link href={ROUTE.SETTINGS}>
          <Button
            className={cn("text-sm", "px-4 py-2")}
            size="icon"
            variant="outline"
          >
            <Settings className="size-4" />
          </Button>
        </Link>
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
      variant="outline"
      className={cn("text-sm", "px-4 py-2", "[&_svg]:size-4")}
      onClick={handleClick}
      ref={hoverRef}
    >
      {renderIcon()}
      {isFollowing ? (isHover ? "Unfollow" : "Following") : "Follow"}
    </Button>
  );
}

export function UserInfoSkeleton() {
  return (
    <div className={cn("w-full relative", "flex flex-col items-center")}>
      <Skeleton className={cn("w-full h-40 -mb-15", "rounded-none")} />
      <Skeleton className="size-28 rounded-full" />

      <div className={cn("mt-3 mb-7", "flex flex-col items-center")}>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24 mt-2" />
        <Skeleton className="h-4 w-48 mt-4" />
      </div>

      <div className={cn("grid grid-cols-2 gap-12", "text-sm", "mb-6")}>
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
