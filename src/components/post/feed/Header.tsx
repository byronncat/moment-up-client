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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Ban, Flag, MoreHorizontal, User, Volume } from "@/components/icons";
import { FilePenLine, FileText, Trash } from "lucide-react";

type HeaderProps = Readonly<{
  data: FeedItemDto;
  actions: Pick<Actions, "follow" | "block" | "report">;
  sideElement?: React.ReactNode;
}>;

export default function Header({ data, actions, sideElement }: HeaderProps) {
  const { id: postId, user, post } = data;
  const { user: currentUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className={cn("px-4 pt-4 pb-3", "flex")}>
      <HoverableComponent
        userInfo={user}
        onFollow={() => actions.follow(postId)}
        tabIndex={-1}
      >
        <Avatar
          src={user.avatar}
          alt={`${user.displayName}'s avatar`}
          size="12"
        />
      </HoverableComponent>

      <div
        className={cn(
          "flex flex-col gap-0.5 flex-1",
          "ml-2.5 mr-3 mt-1",
          "min-w-0"
        )}
      >
        <div className={cn("flex items-center gap-1.5", "min-w-0")}>
          <HoverableComponent
            userInfo={user}
            onFollow={() => actions.follow(postId)}
            className={cn("min-w-0", "focus:underline outline-none")}
          >
            <div className={cn("font-semibold text-base/tight", "truncate")}>
              {user.displayName}
            </div>
          </HoverableComponent>

          <span className="text-base/tight text-muted-foreground">·</span>

          <Tooltip
            sideOffset={4}
            content={dayjs(post.lastModified).format("h:mm A MMM D, YYYY")}
          >
            <div
              className={cn(
                "text-sm/tight text-muted-foreground",
                "cursor-default shrink-0"
              )}
            >
              {Format.date(post.lastModified)}
            </div>
          </Tooltip>
        </div>

        <div className={cn("text-sm text-muted-foreground", "truncate")}>
          @{user.username}
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        {currentUser ? (
          <MoreMenu
            user={user}
            postId={postId}
            isOpen={isDropdownOpen}
            setOpen={setIsDropdownOpen}
            actions={actions}
          />
        ) : null}

        {sideElement ? <div className="flex gap-2">{sideElement}</div> : null}
      </div>
    </div>
  );
}

type MoreMenuProps = Readonly<{
  user: FeedItemDto["user"];
  postId: FeedItemDto["id"];
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  actions: Pick<Actions, "follow" | "block" | "report">;
}>;

function MoreMenu({ isOpen, setOpen, user, postId, actions }: MoreMenuProps) {
  const { user: currentUser } = useAuth();
  const isSelf = currentUser?.id === user.id;

  function handleAction(actionFn: () => void | Promise<void>) {
    setOpen(false);
    setTimeout(() => {
      actionFn();
    }, 0);
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen}>
      <Tooltip content="More options" sideOffset={4}>
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
        {isSelf ? null : (
          <>
            {user.isFollowing ? (
              <DropdownMenuItem
                onClick={() => handleAction(() => actions.follow(postId))}
                className="cursor-pointer"
              >
                <User variant="minus" className="size-4 shrink-0" />
                <span className="truncate">Unfollow @{user.username}</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => handleAction(() => actions.follow(postId))}
                className="cursor-pointer"
              >
                <User variant="plus" className="size-4 shrink-0" />
                <span className="truncate">Follow @{user.username}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => console.log("mute user")}
              className="cursor-pointer"
            >
              <Volume variant="off" className="size-4 shrink-0" />
              <span className="truncate">Mute @{user.username}</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem
          onClick={() => console.log("go to post")}
          className="cursor-pointer"
        >
          <FileText className="size-4 shrink-0" />
          <span className="truncate">Go to post</span>
        </DropdownMenuItem>
        {isSelf ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => console.log("edit post")}
              className="cursor-pointer"
            >
              <FilePenLine className="size-4 shrink-0" />
              <span className="truncate">Edit post</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("delete post")}
              className={cn("cursor-pointer", "destructive-item")}
            >
              <Trash className="size-4 shrink-0" />
              <span className="truncate">Delete post</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleAction(() => actions.block(postId))}
              className={cn("cursor-pointer", "destructive-item")}
            >
              <Ban className="size-4 shrink-0" />
              <span className="truncate">Block @{user.username}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction(() => actions.report(postId))}
              className={cn("cursor-pointer", "destructive-item")}
            >
              <Flag className="size-4 shrink-0" />
              <span className="truncate">Report post</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
