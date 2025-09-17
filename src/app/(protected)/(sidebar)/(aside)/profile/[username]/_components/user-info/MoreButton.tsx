"use client";

import { toast } from "sonner";
import { useAuth } from "@/components/providers";
import { useProfile } from "../../_providers/ProfileProvider";

import { Tooltip } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ban, Flag, Link, MoreHorizontal, Volume } from "@/components/icons";

export default function MoreButton() {
  const { user } = useAuth();
  const { profile, mute, block, report } = useProfile();

  async function handleCopyProfileLink() {
    try {
      const profileUrl = `${window.location.origin}/profile/${profile.username}`;
      await navigator.clipboard.writeText(profileUrl);
      toast(
        <div className="flex items-center gap-2">
          <Link className="size-3" />
          <span>Profile link copied!</span>
        </div>,
        {
          description: "The profile link has been copied to your clipboard.",
        }
      );
    } catch {
      toast(
        <div className="flex items-center gap-2">
          <Link className="size-3" />
          <span>Failed to copy link</span>
        </div>,
        {
          description: "Unable to copy the profile link to your clipboard.",
        }
      );
    }
  }

  function handleMute() {
    mute();
  }

  function handleBlock() {
    block();
  }

  function handleReport() {
    report();
  }

  if (!user) return null;
  return (
    <DropdownMenu>
      <Tooltip content="More" sideOffset={4}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuItem
          onClick={handleCopyProfileLink}
          className="cursor-pointer"
        >
          <Link className="size-4" />
          Copy link to profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleMute} className="cursor-pointer">
          <Volume
            variant={profile.isMuted ? "off" : "regular"}
            className="size-4"
          />
          <span className="truncate">
            {profile.isMuted
              ? `Unmute @${profile.username}`
              : `Mute @${profile.username}`}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleBlock}
          className="destructive-item cursor-pointer"
        >
          <Ban className="size-4" />
          <span className="truncate">Block @{profile.username}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleReport}
          className="destructive-item cursor-pointer"
        >
          <Flag className="size-4" />
          <span className="truncate">Report @{profile.username}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
