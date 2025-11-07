"use client";

import type { FeedItemDto } from "api";
import type { Actions } from "../../providers/PostStorage";
import { CONTENT_REPORT_OPTIONS, ContentPrivacy } from "@/constants/server";
import { REPORT_ICONS } from "@/constants/client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import dayjs from "dayjs";
import Format from "@/utilities/format";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import HoverableComponent from "./HoverInfo";
import { Avatar, Tooltip } from "../../common";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Earth, Flag, Lock, MoreHorizontal, User } from "@/components/icons";
import { FilePenLine, FileText, Trash } from "lucide-react";

type HeaderProps = Readonly<{
  data: FeedItemDto;
  actions: Pick<Actions, "delete" | "follow" | "report">;
  sideElement?: React.ReactNode;
  disablePortal?: boolean;
  className?: string;
}>;

export default function Header({
  data,
  actions,
  disablePortal = false,
  className,
}: HeaderProps) {
  const { id: postId, user, post } = data;
  const { user: currentUser } = useAuth();

  return (
    <div className={cn("px-4 pt-4 pb-3", "flex", className)}>
      <HoverableComponent
        userInfo={user}
        onFollow={() => actions.follow(postId)}
        tabIndex={-1}
      >
        <Avatar
          src={user.avatar}
          alt={`${user.displayName ?? user.username}'s avatar`}
          size="12"
        />
      </HoverableComponent>

      <div
        className={cn("flex flex-col flex-1", "ml-2.5 mr-3 mt-1", "min-w-0")}
      >
        <HoverableComponent
          userInfo={user}
          onFollow={() => actions.follow(postId)}
          align="start"
          className={cn("min-w-0", "focus:underline outline-none")}
        >
          <div className={cn("font-semibold text-base/tight", "truncate")}>
            {user.displayName ?? user.username}
          </div>
        </HoverableComponent>

        <div
          className={cn(
            "flex items-end",
            "min-w-0",
            "text-muted-foreground text-sm"
          )}
        >
          <div className="truncate">@{user.username}</div>

          <span className="mx-1 ">·</span>

          <Tooltip
            sideOffset={4}
            content={
              post.privacy === ContentPrivacy.PRIVATE
                ? "Private"
                : post.privacy === ContentPrivacy.FOLLOWERS
                  ? "Followers only"
                  : "Public"
            }
          >
            <span
              className={cn(
                "shrink-0",
                "flex items-center justify-center h-5",
                "w-4 mr-1"
              )}
            >
              {post.privacy === ContentPrivacy.PRIVATE ? (
                <Lock className="size-4 " />
              ) : post.privacy === ContentPrivacy.FOLLOWERS ? (
                <User type="solid" className="size-3" />
              ) : (
                <Earth className="size-4" />
              )}
            </span>
          </Tooltip>

          <Tooltip
            sideOffset={4}
            content={dayjs(post.lastModified).format("h:mm A MMM D, YYYY")}
          >
            <div className={cn("text-sm", "cursor-default shrink-0")}>
              {Format.date(post.lastModified)}
            </div>
          </Tooltip>
        </div>
      </div>

      {currentUser ? (
        <MoreMenu
          disablePortal={disablePortal}
          user={user}
          postId={postId}
          actions={actions}
          className="shrink-0"
        />
      ) : null}
    </div>
  );
}

type MoreMenuProps = Readonly<{
  user: FeedItemDto["user"];
  postId: FeedItemDto["id"];
  actions: Pick<Actions, "delete" | "follow" | "report">;
  disablePortal?: boolean;
  className?: string;
}>;

function MoreMenu({
  user,
  postId,
  actions,
  disablePortal,
  className,
}: MoreMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: currentUser } = useAuth();
  const isSelf = currentUser?.id === user.id;
  const isPostPage = pathname.startsWith(ROUTE.POST(postId));
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    actions.delete(postId);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent disablePortal={disablePortal}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <Tooltip content="More options" sideOffset={4}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "size-8 rounded-full",
                "text-muted-foreground",
                className
              )}
            >
              <MoreHorizontal className="size-5" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-48" disablePortal={disablePortal}>
          {isSelf ? null : user.isFollowing ? (
            <DropdownMenuItem
              onClick={() => actions.follow(postId)}
              className="cursor-pointer"
            >
              <User variant="minus" className="size-4 shrink-0" />
              <span className="truncate">Unfollow @{user.username}</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => actions.follow(postId)}
              className="cursor-pointer"
            >
              <User variant="plus" className="size-4 shrink-0" />
              <span className="truncate">Follow @{user.username}</span>
            </DropdownMenuItem>
          )}
          {isPostPage ? null : (
            <DropdownMenuItem
              onClick={() => router.push(ROUTE.POST(postId))}
              className="cursor-pointer"
            >
              <FileText className="size-4 shrink-0" />
              <span className="truncate">Go to post</span>
            </DropdownMenuItem>
          )}
          {isPostPage ? null : <DropdownMenuSeparator />}
          {isSelf ? (
            <>
              <DropdownMenuItem
                onClick={() => router.push(ROUTE.POST_UPDATE(postId))}
                className="cursor-pointer"
              >
                <FilePenLine className="size-4 shrink-0" />
                <span className="truncate">Edit post</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className={cn("cursor-pointer", "destructive-item")}
              >
                <Trash className="size-4 shrink-0" />
                <span className="truncate">Delete post</span>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger
                submenuId="report-post"
                className={cn("cursor-pointer", "destructive-item")}
              >
                <Flag className="size-4 shrink-0" />
                <span className="truncate">Report post</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent submenuId="report-post" sideOffset={8} className="w-60">
                {ReportPostOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => actions.report(postId, option.value)}
                    className="cursor-pointer"
                  >
                    {option.icon}
                    <span className="truncate">{option.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

const ReportPostOptions = CONTENT_REPORT_OPTIONS.map((option) => ({
  ...option,
  icon: REPORT_ICONS[option.value],
}));
