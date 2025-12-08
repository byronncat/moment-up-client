"use client";

import { __parseUrl } from "@/__mocks__";

import { useState } from "react";
import { useAuth } from "@/components/providers";
import { useProfile } from "../../_providers/Profile";
import Format from "@/utilities/format";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Avatar as AvatarUI,
  NumberTooltip,
  Tooltip,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MoreButton from "./MoreButton";
import FollowButton from "./FollowButton";
import EditProfileModal from "./EditProfileModal";
import {
  Edit,
  Image as ImageIcon,
  Lock,
  Settings,
  Video,
} from "@/components/icons";

export default function UserInfo() {
  const { user } = useAuth();
  const { profile, canView, isSelf } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className={cn("w-full relative", "flex flex-col items-center")}>
      <div className={cn("relative", "-mb-15", "w-full aspect-3/1")}>
        <Link
          href={ROUTE.PROFILE(profile.username, "header_photo")}
          className={cn(
            "block size-full",
            profile.backgroundImage ? "cursor-pointer" : "cursor-default"
          )}
          tabIndex={profile.backgroundImage ? 0 : -1}
          onClick={(e) => !profile.backgroundImage && e.preventDefault()}
        >
          <div
            className={cn("size-full", "bg-muted")}
            style={{
              ...(profile.backgroundImage && {
                backgroundImage: `url(${__parseUrl(profile.backgroundImage, "image", 640, 640 / 3)})`,
                backgroundSize: "cover",
                backgroundPosition: "start",
              }),
            }}
          />
        </Link>

        <div
          className={cn("flex gap-2", "absolute top-[calc(100%+8px)] right-2")}
        >
          {isSelf ? (
            <>
              <Tooltip content="Edit Profile" sideOffset={4}>
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  className={cn("text-sm", "px-4 py-2")}
                  size="icon"
                  variant="outline"
                >
                  <Edit className="size-4" />
                </Button>
              </Tooltip>
              <Link href={ROUTE.SETTINGS} tabIndex={-1}>
                <Tooltip content="Settings" sideOffset={4}>
                  <Button
                    className={cn("text-sm", "px-4 py-2")}
                    size="icon"
                    variant="outline"
                  >
                    <Settings className="size-4" />
                  </Button>
                </Tooltip>
              </Link>
            </>
          ) : (
            <>
              <MoreButton />
              <FollowButton />
            </>
          )}
        </div>
      </div>

      <Avatar />

      <div
        className={cn(
          "mt-3 mb-6",
          "flex flex-col items-center",
          "w-full px-3 text-center "
        )}
      >
        <div className={cn("font-semibold text-xl", "flex items-center gap-1")}>
          {profile.displayName ?? profile.username}
          {profile.isProtected ? (
            <Lock className="size-4 mt-0.5 text-muted-foreground" />
          ) : null}
        </div>
        <span className={cn("text-muted-foreground text-sm", "mb-3")}>
          @{profile.username}
        </span>
        {profile.bio ? (
          <div
            className={cn(
              "max-w-4/5 w-fit min-h-[48px]",
              "flex flex-col items-center justify-center gap-1.5",
              "text-muted-foreground text-sm text-left"
            )}
          >
            <p>{profile.bio}</p>
          </div>
        ) : (
          isSelf && (
            <div
              className={cn(
                "w-4/5 h-[48px]",
                "flex items-center justify-center"
              )}
            >
              <button
                onClick={() => setIsEditModalOpen(true)}
                className={cn(
                  "text-muted-foreground/60 text-center text-sm italic",
                  "focus-within-indicator rounded-sm cursor-pointer"
                )}
              >
                Write something here...
              </button>
            </div>
          )
        )}
      </div>

      <div className={cn("grid grid-cols-2 gap-10", "text-sm", "mb-6")}>
        <Link
          href={ROUTE.PROFILE(profile.username, "following")}
          className={cn(
            "flex flex-col items-center",
            user
              ? "cursor-pointer focus-within-indicator rounded-sm"
              : "cursor-default"
          )}
          onClick={(event) => !user && event.preventDefault()}
        >
          <NumberTooltip number={profile.following} sideOffset={4}>
            <span className="font-bold">
              {Format.number(profile.following)}
            </span>
          </NumberTooltip>
          <span>Following</span>
        </Link>
        <Link
          href={ROUTE.PROFILE(profile.username, "followers")}
          className={cn(
            "flex flex-col items-center",
            user
              ? "cursor-pointer focus-within-indicator rounded-sm"
              : "cursor-default"
          )}
          onClick={(event) => !user && event.preventDefault()}
        >
          <NumberTooltip number={profile.followers} sideOffset={4}>
            <span className="font-bold">
              {Format.number(profile.followers)}
            </span>
          </NumberTooltip>
          <span>Followers</span>
        </Link>
      </div>

      {canView ? null : (
        <div className={cn("flex flex-col", "mt-8 mx-12 max-w-[360px]")}>
          <span className="text-xl font-bold">This account is protected</span>
          <span className={cn("mt-1", "text-muted-foreground text-sm")}>
            Only approved followers can see @{profile.username}&apos;s posts. To
            request access, click Follow.
          </span>
        </div>
      )}

      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </div>
  );
}

function Avatar() {
  const router = useRouter();
  const { profile, canView } = useProfile();

  function handleStoryClick() {
    router.push(ROUTE.STORY(profile.username));
  }

  function handleAvatarClick() {
    router.push(ROUTE.PROFILE(profile.username, "avatar"));
  }

  const content = {
    default: (
      <AvatarUI
        src={profile.avatar}
        alt={`${profile.displayName ?? profile.username}'s profile`}
        size="26"
      />
    ),
    story: (
      <Link href={ROUTE.STORY(profile.username)} className="cursor-pointer">
        <AvatarUI
          src={profile.avatar}
          alt={`${profile.displayName ?? profile.username}'s profile`}
          size="26"
          ring
          showRing={profile.hasStory}
        />
      </Link>
    ),
    avatar: (
      <Link
        href={ROUTE.PROFILE(profile.username, "avatar")}
        className="cursor-pointer"
      >
        <AvatarUI
          src={profile.avatar}
          alt={`${profile.displayName ?? profile.username}'s profile`}
          size="26"
        />
      </Link>
    ),
    both: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "z-10 rounded-full",
              "cursor-pointer hover:opacity-95 transition-opacity",
              "focus-within-indicator"
            )}
          >
            <AvatarUI
              src={profile.avatar}
              alt={`${profile.displayName ?? profile.username}'s profile`}
              size="26"
              ring
              showRing={profile.hasStory}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[180px]">
          <DropdownMenuItem
            onClick={handleStoryClick}
            className="cursor-pointer"
          >
            <Video className="size-4 text-muted-foreground" />
            View story
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleAvatarClick}
            className="cursor-pointer"
          >
            <ImageIcon className="size-4 text-muted-foreground" />
            View avatar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  };

  const key =
    (profile.hasStory ? 1 : 0) * 2 + // bit 1
    (profile.avatar ? 1 : 0) * 1; // bit 0

  switch (key) {
    // 0b00 = 0 → none
    case 0:
      return content.default;
    // 0b01 = 1 → avatar only
    case 1:
      return content.avatar;
    // 0b10 = 2 → story only
    case 2:
      return canView ? content.story : content.default;
    // 0b11 = 3 → both
    case 3:
      return canView ? content.both : content.avatar;
  }
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
