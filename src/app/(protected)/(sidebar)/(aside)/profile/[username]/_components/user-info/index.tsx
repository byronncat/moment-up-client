"use client";

import { __parseImageUrl } from "@/__mocks__";

import { useState } from "react";
import { useAuth } from "@/components/providers";
import { useProfile } from "../../_providers/ProfileProvider";
import Format from "@/utilities/format";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar, NumberTooltip, Tooltip } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MoreButton from "./MoreButton";
import FollowButton from "./FollowButton";
import EditProfileModal from "./EditProfileModal";
import { Edit, Lock, Settings } from "@/components/icons";

export default function UserInfo() {
  const { user } = useAuth();
  const { profile, isProtected } = useProfile();
  const isSelf = user?.id === profile.id;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className={cn("w-full relative", "flex flex-col items-center")}>
      <div className={cn("relative", "-mb-15", "w-full aspect-[3/1]")}>
        <div
          className={cn("size-full", "bg-muted")}
          style={{
            ...(profile.backgroundImage && {
              backgroundImage: `url(${__parseImageUrl(profile.backgroundImage, 640, 640 / 3)})`,
              backgroundSize: "cover",
              backgroundPosition: "start",
            }),
          }}
        />

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
              <Link href={ROUTE.SETTINGS}>
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

      <Avatar
        src={__parseImageUrl(profile.avatar, 120, 120)}
        alt={`${profile.displayName ?? profile.username}'s profile`}
        size="26"
        ring
        showRing={profile.hasStory}
        className="z-10"
      />

      <div
        className={cn(
          "mt-3 mb-6",
          "flex flex-col items-center",
          "w-full px-3 text-center "
        )}
      >
        <div className={cn("font-semibold text-xl", "flex items-center gap-1")}>
          {profile.displayName ?? profile.username}
          {isProtected ? (
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
                  "cursor-pointer"
                )}
              >
                Write something here...
              </button>
            </div>
          )
        )}
      </div>

      <div className={cn("grid grid-cols-2 gap-10", "text-sm", "mb-6")}>
        <div className="flex flex-col items-center">
          <NumberTooltip number={profile.following} sideOffset={4}>
            <span className="font-bold">
              {Format.number(profile.following)}
            </span>
          </NumberTooltip>
          <span>Following</span>
        </div>
        <div className="flex flex-col items-center">
          <NumberTooltip number={profile.followers} sideOffset={4}>
            <span className="font-bold">
              {Format.number(profile.followers)}
            </span>
          </NumberTooltip>
          <span>Followers</span>
        </div>
      </div>

      {isProtected ? (
        <div className={cn("flex flex-col", "mt-8 mx-12 max-w-[360px]")}>
          <span className="text-xl font-bold">This account is protected</span>
          <span className={cn("mt-1", "text-muted-foreground text-sm")}>
            Only approved followers can see @{profile.username}&apos;s posts. To
            request access, click Follow.
          </span>
        </div>
      ) : null}

      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </div>
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
