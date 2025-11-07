"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers";
import { useProfile } from "../../_providers/Profile";
import { toast } from "sonner";
import { UserReportType } from "@/constants/server";

import { Tooltip } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ban,
  Flag,
  Link,
  MoreHorizontal,
  User,
  Volume,
} from "@/components/icons";
import {
  AlertTriangle,
  Angry,
  EyeOff,
  HelpCircle,
  Info,
  MessageCircleWarning,
  ShieldAlert,
  Skull,
} from "lucide-react";

export default function MoreButton() {
  const { user } = useAuth();
  const { profile, mute, block, report, removeFollower } = useProfile();
  const [isBlocked, setIsBlocked] = useState(false);

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

  function handleRemoveFollower() {
    removeFollower();
  }

  function handleMute() {
    mute();
  }

  function handleBlock() {
    if (isBlocked) return;
    block();
    setIsBlocked(!isBlocked);
  }

  function handleReport(reportType: UserReportType) {
    report(reportType);
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
        {profile.isFollower ? (
          <DropdownMenuItem
            onClick={handleRemoveFollower}
            className="cursor-pointer"
          >
            <User variant="minus" className="size-4" />
            Remove this follower
          </DropdownMenuItem>
        ) : null}
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

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleBlock}
          className="destructive-item cursor-pointer"
        >
          <Ban className="size-4" />
          <span className="truncate">
            {isBlocked
              ? `Unblock @${profile.username}`
              : `Block @${profile.username}`}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger submenuId="report-user" className="destructive-item cursor-pointer">
            <Flag className="size-4" />
            <span className="truncate">Report @{profile.username}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent submenuId="report-user" sideOffset={8}>
            {ReportOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleReport(option.value)}
                className="cursor-pointer"
              >
                {option.icon}
                <span>{option.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const ReportOptions = [
  {
    label: "Spam",
    icon: <Ban className="size-4" />,
    value: UserReportType.SPAM,
  },
  {
    label: "Impersonation",
    icon: <User variant="x" className="size-4" />,
    value: UserReportType.IMPERSONATION,
  },
  {
    label: "Inappropriate content",
    icon: <AlertTriangle className="size-4" />,
    value: UserReportType.INAPPROPRIATE_CONTENT,
  },
  {
    label: "Abusive",
    icon: <Angry className="size-4" />,
    value: UserReportType.ABUSIVE,
  },
  {
    label: "Harmful",
    icon: <Skull className="size-4" />,
    value: UserReportType.HARMFUL,
  },
  {
    label: "Child exploration",
    icon: <ShieldAlert className="size-4" />,
    value: UserReportType.CHILD_EXPLORATION,
  },
  {
    label: "Sexual content",
    icon: <MessageCircleWarning className="size-4" />,
    value: UserReportType.SEXUAL_CONTENT,
  },
  {
    label: "Fake information",
    icon: <Info className="size-4" />,
    value: UserReportType.FAKE_INFORMATION,
  },
  {
    label: "Don't want to see",
    icon: <EyeOff className="size-4" />,
    value: UserReportType.DONT_WANT_TO_SEE,
  },
  {
    label: "Other",
    icon: <HelpCircle className="size-4" />,
    value: UserReportType.OTHER,
  },
];
