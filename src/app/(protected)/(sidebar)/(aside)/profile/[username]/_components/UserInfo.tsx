"use client";

import type { ProfileDto } from "api";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useHover } from "usehooks-ts";
import { toast } from "sonner";
import { useAuth } from "@/components/providers";
import { useProfile } from "../_providers/ProfileProvider";
import Format from "@/utilities/format";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Ban, Copy, Flag, Lock, MoreHorizontal, Settings, User, Volume } from "@/components/icons";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type UserInformationProps = Readonly<{
  data: ProfileDto;
}>;

export default function UserInfo({ data }: UserInformationProps) {
  const { isFollowing, follow } = useProfile();
  const { user } = useAuth();
  const isSelf = user?.id === data.id;

  return (
    <div className={cn("w-full relative", "flex flex-col items-center")}>
      <div
        className={cn("w-full h-40", "-mb-15 bg-muted")}
        style={{
          ...(data.backgroundImage && {
            backgroundImage: `url(${data.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "start",
          }),
        }}
      />

      <Avatar
        src={data.avatar}
        alt={`${data.username}'s profile`}
        size="26"
        ring
        showRing={data.hasStory}
      />

      <div
        className={cn(
          "mt-3 mb-6",
          "flex flex-col items-center",
          "w-full px-3 text-center "
        )}
      >
        <div className={cn("font-semibold text-xl", "flex items-center gap-1")}>
          {data.username}
          {data.isProtected ? (
            <Lock className="size-4 mt-0.5 text-muted-foreground" />
          ) : null}
        </div>
        <span className={cn("text-muted-foreground text-sm", "mb-3")}>
          @{data.username}
        </span>
        {data.bio ? (
          <div
            className={cn(
              "max-w-4/5 w-fit min-h-[48px]",
              "flex flex-col items-center justify-center gap-1.5",
              "text-muted-foreground text-sm text-left"
            )}
          >
            <p>{data.bio}</p>
          </div>
        ) : (
          isSelf && (
            <div
              className={cn(
                "w-4/5 h-[48px]",
                "flex items-center justify-center"
              )}
            >
              <p className="text-muted-foreground/60 text-center text-sm italic">
                Write something here...
              </p>
            </div>
          )
        )}
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

      {data.isProtected ? (
        <div className={cn("flex flex-col", "mt-8 mx-12 max-w-[360px]")}>
          <span className="text-xl font-bold">This account is protected</span>
          <span className={cn("mt-1", "text-muted-foreground text-sm")}>
            Only approved followers can see @{data.username}&apos;s posts. To
            request access, click Follow.
          </span>
        </div>
      ) : null}

      <div className="flex gap-2 absolute top-42 right-2">
        {isSelf ? (
          <Link href={ROUTE.SETTINGS}>
            <Button
              className={cn("text-sm", "px-4 py-2")}
              size="icon"
              variant="outline"
            >
              <Settings className="size-4" />
            </Button>
          </Link>
        ) : (
          <>
            <MoreDropdownButton username={data.username} />
            <FollowButton isFollowing={isFollowing} onFollow={follow} />
          </>
        )}
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
  const router = useRouter();
  const { user } = useAuth();

  function handleNavigate(event: React.MouseEvent) {
    event.preventDefault();
    router.push(ROUTE.LOGIN);
  }

  async function handleClick(event: React.MouseEvent) {
    if (!onFollow) return;
    await onFollow(event);
  }

  const renderIcon = () => {
    if (isFollowing)
      return isHover ? <User variant="minus" /> : <User variant="check" />;
    return <User variant="plus" />;
  };

  return (
    <Button
      variant={isFollowing && isHover ? "destructive" : "outline"}
      className={cn(
        "text-sm",
        "size-9 sm:px-4 sm:py-2 sm:w-[128px]",
        "[&_svg]:size-4"
      )}
      onClick={user ? handleClick : handleNavigate}
      ref={hoverRef}
    >
      {renderIcon()}
      <span className="hidden sm:block">
        {isFollowing ? (isHover ? "Unfollow" : "Following") : "Follow"}
      </span>
    </Button>
  );
}

type MoreDropdownButtonProps = Readonly<{
  username: string;
}>;

function MoreDropdownButton({ username }: MoreDropdownButtonProps) {
  const handleCopyProfileLink = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${username}`;
      await navigator.clipboard.writeText(profileUrl);
      toast("Profile link copied!", {
        description: "The profile link has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy profile link:', error);
      toast("Failed to copy link", {
        description: "Unable to copy the profile link to your clipboard.",
      });
    }
  };

  const handleMute = () => {
    // TODO: Implement mute functionality
  };

  const handleBlock = () => {
    // TODO: Implement block functionality
  };

  const handleReport = () => {
    // TODO: Implement report functionality
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyProfileLink}>
          <Copy className="mr-2 h-4 w-4" />
          Copy profile link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleMute}>
          <Volume className="mr-2 h-4 w-4" />
          Mute @{username}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleBlock}>
          <Ban className="mr-2 h-4 w-4" />
          Block @{username}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleReport}>
          <Flag className="mr-2 h-4 w-4" />
          Report @{username}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserInfoSkeleton() {
  return (
    <div
      className={cn("h-[420px] w-full relative", "flex flex-col items-center")}
    >
      <Skeleton className={cn("w-full h-40 -mb-15", "rounded-none")} />
      <Skeleton className="size-28 rounded-full" />

      <div className={cn("mt-4 mb-10", "flex flex-col items-center")}>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24 mt-2" />
        <Skeleton className="h-4 w-48 mt-7" />
      </div>

      <div className={cn("grid grid-cols-2 gap-12", "text-sm", "mb-6")}>
        <div className="flex flex-col items-center gap-1.5">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
