"use client";

import type { FeedItemDto } from "api";
import type { Actions } from "../../providers/PostStorage";
import { ContentReportType } from "@/constants/server";

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
import { Flag, MoreHorizontal, User } from "@/components/icons";
import {
  AlertTriangle,
  Angry,
  CircleHelp,
  Copy,
  FilePenLine,
  FileText,
  Info,
  MessageCircleWarning,
  ShieldAlert,
  Skull,
  Trash,
} from "lucide-react";

type HeaderProps = Readonly<{
  data: FeedItemDto;
  actions: Pick<Actions, "delete" | "follow" | "report">;
  sideElement?: React.ReactNode;
  portalDisabled?: boolean;
  className?: string;
}>;

export default function Header({
  data,
  actions,
  portalDisabled,
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
              {user.displayName ?? user.username}
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

      {currentUser ? (
        <MoreMenu
          portalDisabled={portalDisabled}
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
  portalDisabled?: boolean;
  className?: string;
}>;

function MoreMenu({
  user,
  postId,
  actions,
  portalDisabled,
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
        <AlertDialogContent portalDisabled={portalDisabled}>
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
        <DropdownMenuContent align="end" className="w-48" portalDisabled>
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
                className={cn("cursor-pointer", "destructive-item")}
              >
                <Flag className="size-4 shrink-0" />
                <span className="truncate">Report post</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent sideOffset={8} className="w-60">
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

const ReportPostOptions: Array<{
  label: string;
  value: ContentReportType;
  icon: React.ReactNode;
}> = [
  {
    label: "Spam",
    value: ContentReportType.SPAM,
    icon: <Copy className="size-4 shrink-0" />,
  },
  {
    label: "Misleading",
    value: ContentReportType.MISLEADING,
    icon: <MessageCircleWarning className="size-4 shrink-0" />,
  },
  {
    label: "Inappropriate content",
    value: ContentReportType.INAPPROPRIATE_CONTENT,
    icon: <AlertTriangle className="size-4 shrink-0" />,
  },
  {
    label: "Abusive",
    value: ContentReportType.ABUSIVE,
    icon: <Angry className="size-4 shrink-0" />,
  },
  {
    label: "Harmful",
    value: ContentReportType.HARMFUL,
    icon: <Skull className="size-4 shrink-0" />,
  },
  {
    label: "Sexual content",
    value: ContentReportType.SEXUAL_CONTENT,
    icon: <MessageCircleWarning className="size-4 shrink-0" />,
  },
  {
    label: "Child exploitation",
    value: ContentReportType.CHILD_EXPLOITATION,
    icon: <ShieldAlert className="size-4 shrink-0" />,
  },
  {
    label: "Copyright violation",
    value: ContentReportType.COPYRIGHT_VIOLATION,
    icon: <Info className="size-4 shrink-0" />,
  },
  {
    label: "Violence",
    value: ContentReportType.VIOLENCE,
    icon: <AlertTriangle className="size-4 shrink-0" />,
  },
  {
    label: "Hate speech",
    value: ContentReportType.HATE_SPEECH,
    icon: <Angry className="size-4 shrink-0" />,
  },
  {
    label: "Fake information",
    value: ContentReportType.FAKE_INFORMATION,
    icon: <Info className="size-4 shrink-0" />,
  },
  {
    label: "Duplicate",
    value: ContentReportType.DUPLICATE,
    icon: <Copy className="size-4 shrink-0" />,
  },
  {
    label: "Other",
    value: ContentReportType.OTHER,
    icon: <CircleHelp className="size-4 shrink-0" />,
  },
];
