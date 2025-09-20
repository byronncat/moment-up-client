"use client";

import type { FeedItemDto } from "api";
import type { Actions } from "../../providers/MomentStorage";

import { useState } from "react";
import { useAuth } from "@/components/providers";
import dayjs from "dayjs";
import Format from "@/utilities/format";

import { cn } from "@/libraries/utils";
import HoverableComponent from "./HoverInfo";
import { Avatar, Tooltip } from "../../common";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Ban, Flag, MoreHorizontal, User } from "@/components/icons";

type HeaderProps = Readonly<{
  data: FeedItemDto;
  actions: Pick<Actions, "follow" | "block" | "report">;
  sideElement?: React.ReactNode;
  truncateClassName?: string;
}>;

export default function Header({
  data,
  actions,
  sideElement,
  truncateClassName,
}: HeaderProps) {
  const { id: momentId, user, post } = data;
  const { user: currentUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className={cn("px-4 pt-4 pb-3", "flex gap-2")}>
      <HoverableComponent
        userInfo={user}
        onFollow={() => actions.follow(momentId)}
      >
        <Avatar
          src={user.avatar}
          alt={`${user.displayName}'s avatar`}
          size="12"
        />
      </HoverableComponent>

      <div className={cn("flex flex-col", "mt-1 flex-1")}>
        <div className="flex items-center gap-1">
          <HoverableComponent
            userInfo={user}
            onFollow={() => actions.follow(momentId)}
          >
            <span
              className={cn("font-semibold text-base/tight", truncateClassName)}
            >
              {user.displayName}
            </span>
          </HoverableComponent>
          <span className="text-base/tight text-muted-foreground">·</span>
          <Tooltip
            sideOffset={4}
            content={dayjs(post.createdAt).format("h:mm A MMM D, YYYY")}
          >
            <span className="text-sm/tight text-muted-foreground cursor-default">
              {Format.date(post.createdAt)}
            </span>
          </Tooltip>
        </div>
        <HoverableComponent
          userInfo={user}
          onFollow={() => actions.follow(momentId)}
        >
          <span
            className={cn("text-sm text-muted-foreground", truncateClassName)}
          >
            @{user.username}
          </span>
        </HoverableComponent>
      </div>

      {currentUser ? (
        <MoreMenu
          isOpen={isDropdownOpen}
          setOpen={setIsDropdownOpen}
          user={user}
          momentId={momentId}
          actions={actions}
        />
      ) : null}

      {sideElement ? <div className="flex gap-2">{sideElement}</div> : null}
    </div>
  );
}

type MoreMenuProps = Readonly<{
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  user: FeedItemDto["user"];
  momentId: FeedItemDto["id"];
  actions: Pick<Actions, "follow" | "block" | "report">;
}>;

function MoreMenu({ isOpen, setOpen, user, momentId, actions }: MoreMenuProps) {
  const handleAction = (actionFn: () => void | Promise<void>) => {
    setOpen(false);
    setTimeout(() => {
      actionFn();
    }, 0);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen}>
      <Tooltip content="More options">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-8 rounded-full", "text-muted-foreground")}
          >
            <MoreHorizontal className="size-5" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-48">
        {user.isFollowing ? (
          <DropdownMenuItem
            onClick={() => handleAction(() => actions.follow(momentId))}
            className="cursor-pointer"
          >
            <User variant="minus" className="size-4 shrink-0" />
            <span className="truncate">Unfollow @{user.username}</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => handleAction(() => actions.follow(momentId))}
            className="cursor-pointer"
          >
            <User variant="plus" className="size-4 shrink-0" />
            <span className="truncate">Follow @{user.username}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => handleAction(() => actions.block(momentId))}
          className={cn("cursor-pointer", "destructive-item")}
        >
          <Ban className="size-4 shrink-0" />
          <span className="truncate">Block @{user.username}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAction(() => actions.report(momentId))}
          className={cn("cursor-pointer", "destructive-item")}
        >
          <Flag className="size-4 shrink-0" />
          <span className="truncate">Report post</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
