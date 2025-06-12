"use client";

import type { DetailedMoment } from "api";

import { useState } from "react";
import { cn } from "@/libraries/utils";
import dayjs from "dayjs";
import { UserApi } from "@/services";
import { useData } from "./provider/Data";

import { Avatar } from "../../common";
import { CardHeader } from "../../ui/card";
import HoverableComponent from "./HoverInfo";

export default function Header() {
  const [isFollowing, setIsFollowing] = useState(false);
  const { userData: user, postData: post } = useData();

  function followHandler(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isFollowing) UserApi.unfollowUser(user.id);
    else UserApi.followUser(user.id);
    setIsFollowing((prev) => !prev);
  }

  return (
    <CardHeader className={cn("p-3 space-y-0", "flex flex-row gap-2")}>
      <HoverableComponent
        userInfo={user}
        isFollowing={isFollowing}
        followHandler={followHandler}
      >
        <Avatar
          src={user.avatar}
          alt={`${user.displayName}'s avatar`}
          size="12"
        />
      </HoverableComponent>
      <div className={cn("flex flex-col", "mt-1")}>
        <div className="flex items-center gap-1">
          <HoverableComponent
            userInfo={user}
            isFollowing={isFollowing}
            followHandler={followHandler}
          >
            <span
              className={cn(
                "font-semibold text-base/tight",
                "truncate max-w-[192px] md:max-w-[320px]"
              )}
            >
              {user.displayName}
            </span>
          </HoverableComponent>
          <span className="text-base/tight text-muted-foreground">·</span>
          <span className="text-sm/tight text-muted-foreground">
            {dayjs(post.created_at).fromNow()}
          </span>
        </div>
        <HoverableComponent
          userInfo={user}
          isFollowing={isFollowing}
          followHandler={followHandler}
        >
          <span className="text-sm text-muted-foreground">
            @{user.username}
          </span>
        </HoverableComponent>
      </div>
    </CardHeader>
  );
}
