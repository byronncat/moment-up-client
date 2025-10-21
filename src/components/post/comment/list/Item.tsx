import type { CommentDto } from "api";

import { useState } from "react";
import { useAuth, useComment } from "@/components/providers";
import dayjs from "dayjs";
import Format from "@/utilities/format";

import { cn } from "@/libraries/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Avatar, Tooltip } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import HoverCard from "./HoverCard";
import { Heart, MoreHorizontal } from "@/components/icons";

type CommentItemProps = Readonly<{
  comment: CommentDto;
  isExpanded: boolean;
  onToggleExpand: () => void;
}>;

export default function Item({
  comment,
  isExpanded,
  onToggleExpand,
}: CommentItemProps) {
  const { user } = useAuth();
  const { likeComment, deleteComment } = useComment();
  const isOwnComment = user?.id === comment.user.id;

  const [canExpand, setCanExpand] = useState<boolean>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function handleLike() {
    likeComment(comment.id, !comment.isLiked);
  }

  function handleDelete() {
    deleteComment(comment.id);
  }

  return (
    <div className="flex items-start gap-2.5">
      <HoverCard
        data={comment.user}
        className="hover:opacity-80 transition-opacity duration-150 ease-in-out"
        tabIndex={-1}
      >
        <Avatar src={comment.user.avatar} size="12" />
      </HoverCard>

      <div className="flex flex-col flex-1 min-w-0">
        <Header user={comment.user} lastModified={comment.lastModified} />

        <p
          ref={(element) => {
            if (element && canExpand === undefined) {
              const isTextClamped = element.scrollHeight > element.clientHeight;
              setCanExpand(isTextClamped);
            }
          }}
          className={cn("text-sm", !isExpanded && "line-clamp-3")}
        >
          {comment.text}
        </p>

        {canExpand ? (
          <button
            onClick={onToggleExpand}
            className={cn(
              "pt-1",
              "font-semibold text-xs text-muted-foreground",
              "cursor-pointer hover:underline",
              "transition-opacity duration-150",
              "text-left",
              "flex items-center gap-1"
            )}
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        ) : null}

        <div className={cn("pt-2", "flex items-center gap-2")}>
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5",
              "text-xs text-muted-foreground",
              "hover:text-pink-500 dark:hover:text-pink-400",
              "focus:text-pink-500 dark:focus:text-pink-400",
              "transition-colors duration-150 ",
              "cursor-pointer group outline-none"
            )}
          >
            <span className="h-4">
              <Heart
                type={comment.isLiked ? "solid" : "regular"}
                className={cn(
                  "size-3.5 transition-colors duration-150",
                  comment.isLiked
                    ? "fill-pink-500"
                    : "fill-muted-foreground group-hover:fill-pink-500 dark:group-hover:fill-pink-400 group-focus:fill-pink-500 dark:group-focus:fill-pink-400"
                )}
              />
            </span>
            {comment.likes > 0 && (
              <span className="text-5">{Format.number(comment.likes)}</span>
            )}
          </button>
          {isOwnComment ? (
            <MoreMenu
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              onDelete={handleDelete}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Header({
  user,
  lastModified,
}: Readonly<{
  user: CommentDto["user"];
  lastModified: CommentDto["lastModified"];
}>) {
  return (
    <div className={cn("flex items-center gap-1", "min-w-0 mb-1")}>
      <HoverCard
        data={user}
        className={cn(
          "flex items-baseline gap-1.5 min-w-0",
          "group outline-none"
        )}
      >
        <span
          className={cn(
            "text-sm font-semibold",
            "truncate",
            "group-hover:underline group-focus:underline"
          )}
        >
          {user.displayName ?? user.username}
        </span>
        <span className={cn("text-xs text-muted-foreground", "truncate")}>
          @{user.username}
        </span>
      </HoverCard>
      <Tooltip
        sideOffset={4}
        content={dayjs(lastModified).format("h:mm A MMM D, YYYY")}
      >
        <p
          className={cn(
            "text-xs text-muted-foreground cursor-default",
            "shrink-0 ml-auto"
          )}
        >
          {Format.date(lastModified)}
        </p>
      </Tooltip>
    </div>
  );
}

type MoreMenuProps = Readonly<{
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onDelete: () => void;
}>;

function MoreMenu({ isDialogOpen, setIsDialogOpen, onDelete }: MoreMenuProps) {
  function handleDelete() {
    onDelete();
    setIsDialogOpen(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="size-5 rounded-full">
          <MoreHorizontal className="size-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md [&>button]:hidden p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Comment Options</DialogTitle>
          <DialogDescription>
            Select an option to perform on this comment.
          </DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-col">
          <button
            onClick={handleDelete}
            className={cn(
              "py-3",
              "flex items-center justify-center",
              "font-bold text-destructive hover:bg-destructive/12",
              "cursor-pointer"
            )}
          >
            Delete
          </button>
          <Separator />
          <button
            onClick={() => setIsDialogOpen(false)}
            className={cn(
              "py-3",
              "flex items-center justify-center",
              "hover:bg-accent/7",
              "cursor-pointer"
            )}
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
