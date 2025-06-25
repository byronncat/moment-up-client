"use client";

import type { UserProfileInfo } from "api";
import { useRef } from "react";
import { useHover } from "usehooks-ts";
import { useProfile } from "../_providers/ProfileProvider";
import format from "@/utilities/format";
import { ROUTE } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components";
import { Button } from "@/components/ui/button";
import { Settings, User } from "@/components/icons";

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
            {format.number(data.following ?? 0)}
          </span>
          <span>Following</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">
            {format.number(data.followers ?? 0)}
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
