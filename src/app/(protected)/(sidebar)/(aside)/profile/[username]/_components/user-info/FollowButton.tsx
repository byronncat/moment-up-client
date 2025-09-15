"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useHover } from "usehooks-ts";
import { useAuth } from "@/components/providers";
import { useProfile } from "../../_providers/ProfileProvider";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { User } from "@/components/icons";

export default function FollowButton() {
  const hoverRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(hoverRef as React.RefObject<HTMLElement>);
  const router = useRouter();
  const { user } = useAuth();
  const { profile, follow } = useProfile();

  function handleNavigate(event: React.MouseEvent) {
    event.preventDefault();
    router.push(ROUTE.LOGIN);
  }

  function handleFollow() {
    follow();
  }

  const renderIcon = () => {
    if (profile.isFollowing)
      return isHover ? <User variant="minus" /> : <User variant="check" />;
    return <User variant="plus" />;
  };

  return (
    <Button
      variant={profile.isFollowing && isHover ? "destructive" : "outline"}
      className={cn(
        "text-sm",
        "size-9 sm:px-4 sm:py-2 sm:w-[128px]",
        "[&_svg]:size-4"
      )}
      onClick={user ? handleFollow : handleNavigate}
      ref={hoverRef}
    >
      {renderIcon()}
      <span className="hidden sm:block">
        {profile.isFollowing ? (isHover ? "Unfollow" : "Following") : "Follow"}
      </span>
    </Button>
  );
}
