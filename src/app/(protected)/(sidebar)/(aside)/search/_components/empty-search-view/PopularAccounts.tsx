"use client";

import type { PopularProfileItem } from "api";

import { useRef, useState } from "react";
import { useHover } from "usehooks-ts";
import { useRefreshApi } from "@/components/providers";
import { UserApi } from "@/services";
import { toast } from "sonner";
import { ROUTE } from "@/constants/route";

import Link from "next/link";
import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { Button } from "@/components/ui/button";

interface PopularAccountsProps {
  users: PopularProfileItem[];
  className?: string;
}

export default function PopularAccounts({
  users,
  className,
}: Readonly<PopularAccountsProps>) {
  return (
    users.length > 0 && (
      <div className={className}>
        <Header />
        <div className={cn("grid grid-cols-2", "px-2 gap-2")}>
          {users.map((user) => (
            <UserCard user={user} key={user.id} />
          ))}
        </div>
      </div>
    )
  );
}

function Header() {
  return (
    <div className={cn("flex justify-between items-center", "mb-2 px-4")}>
      <h2 className="font-semibold">Popular accounts</h2>
    </div>
  );
}

function UserCard({ user }: Readonly<{ user: PopularProfileItem }>) {
  const [isFollowing, setIsFollowing] = useState(false);
  const hoverRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(hoverRef as React.RefObject<HTMLElement>);

  const follow = useRefreshApi(UserApi.follow);
  async function handleFollow(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setIsFollowing(!isFollowing);
    const { success, message } = await follow({
      targetId: user.id,
      shouldFollow: !isFollowing,
    });
    if (!success) {
      setIsFollowing(isFollowing);
      toast.error(message || "Failed to follow/unfollow user");
    }
  }

  return (
    <div
      className={cn(
        "p-3 h-[200px]",
        "flex flex-col items-center",
        "border border-border",
        "text-center",
        "rounded-lg relative overflow-hidden"
      )}
    >
      <div
        style={{
          backgroundImage: user.backgroundImage
            ? `url(${user.backgroundImage})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className={cn("absolute inset-0 h-10")}
      />

      <Avatar src={user.avatar} size="12" />

      <div
        className={cn(
          "flex items-center mt-1",
          "font-semibold",
          "max-w-32"
        )}
      >
        <p className="w-full truncate">{user.username}</p>
      </div>

      <div className="grow px-2 mt-1">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {user.bio || `@${user.username}`}
        </p>
      </div>

      <div className="flex items-center gap-2 w-full mt-3">
        <Button
          ref={hoverRef}
          variant={isFollowing && isHover ? "destructive" : "outline"}
          size="sm"
          className="flex-1/2"
          onClick={handleFollow}
        >
          {isFollowing ? (isHover ? "Unfollow" : "Following") : "Follow"}
        </Button>
        <Link
          href={ROUTE.PROFILE(user.username)}
          className="block flex-1/2 h-full"
        >
          <Button size="sm" className="size-full">
            View
          </Button>
        </Link>
      </div>
    </div>
  );
}
