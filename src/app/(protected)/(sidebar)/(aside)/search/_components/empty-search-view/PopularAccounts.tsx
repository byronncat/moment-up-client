"use client";

import { __parseUrl } from "@/__mocks__";
import type { PopularUserDto } from "api";

import { useRef, useState } from "react";
import { useHover } from "usehooks-ts";
import { usePost, useRefreshApi } from "@/components/providers";
import { useSearch } from "../../_providers/Search";
import { UserApi } from "@/services";
import { toast } from "sonner";
import { ROUTE } from "@/constants/route";

import Link from "next/link";
import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "../LoadingIndicator";

export default function PopularAccounts({
  className,
}: Readonly<{ className?: string }>) {
  const { popularUsers, isLoadingPopular, errorPopular } = useSearch();

  if (isLoadingPopular) return <LoadingIndicator />;
  if (errorPopular || popularUsers.length === 0) return null;
  const users = popularUsers;
  return (
    <div className={className}>
      <Header />
      <div className={cn("grid grid-cols-2", "px-2 gap-2")}>
        {users.map((user) => (
          <UserCard user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className={cn("flex justify-between items-center", "mb-2 px-4")}>
      <h2 className="font-semibold">Popular accounts</h2>
    </div>
  );
}

function UserCard({ user }: Readonly<{ user: PopularUserDto }>) {
  const [isFollowing, setIsFollowing] = useState(false);
  const hoverRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(hoverRef as React.RefObject<HTMLElement>);
  const { incrementActionKey } = usePost();

  const follow = useRefreshApi(UserApi.follow);
  async function handleFollow(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setIsFollowing(!isFollowing);
    const { success, message } = await follow({
      targetId: user.id,
      shouldFollow: !isFollowing,
    });
    if (success) incrementActionKey();
    else {
      setIsFollowing(isFollowing);
      toast.error(message || "Failed to follow/unfollow user");
    }
  }

  return (
    <div
      className={cn(
        "text-center",
        "flex flex-col items-center",
        "h-[200px] border border-border",
        "rounded-lg overflow-hidden"
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
        className="h-10 w-full"
      />

      <Avatar
        src={__parseUrl(user.avatar, "image", 48)}
        size="12"
        className="-mt-6"
      />

      <div
        className={cn("flex items-center mt-1", "font-semibold", "max-w-32")}
      >
        <p className="w-full truncate">{user.username}</p>
      </div>

      <div className="grow px-2 mt-1">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {user.bio ?? `@${user.username}`}
        </p>
      </div>

      <div className={cn("flex items-center gap-2", "w-full mt-3 px-3 pb-3")}>
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
          tabIndex={-1}
        >
          <Button size="sm" className="size-full">
            View
          </Button>
        </Link>
      </div>
    </div>
  );
}
