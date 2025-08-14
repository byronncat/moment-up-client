import type { CommentInfo } from "api";

import { useEffect, useRef, useState } from "react";
import { useTextClamp } from "@/hooks";
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
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import HoverCard from "./HoverCard";
import { Heart, MoreHorizontal } from "@/components/icons";

type CommentItemProps = Readonly<{
  comment: CommentInfo;
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

  const textRef = useRef<HTMLParagraphElement>(null);
  const isTextClamped = useTextClamp(textRef);
  const [canExpand, setCanExpand] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isFirstRender = useRef(true);

  async function handleLike() {
    await likeComment(comment.id, comment.isLiked);
  }

  async function handleDelete() {
    await deleteComment(comment.id);
  }

  useEffect(() => {
    if (isFirstRender.current && isTextClamped) {
      isFirstRender.current = false;
      setCanExpand(isTextClamped);
    }
  }, [isTextClamped]);

  return (
    <div className="flex items-start gap-3">
      <HoverCard data={comment.user}>
        <Avatar src={comment.user.avatar} size="12" />
      </HoverCard>

      <div className="flex flex-col flex-1">
        <Header user={comment.user} updatedAt={comment.updatedAt} />

        <p
          ref={textRef}
          className={cn("text-sm", !isExpanded && "line-clamp-3")}
        >
          {comment.content}
        </p>

        {canExpand && (
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
        )}

        <div className={cn("pt-2", "flex items-center gap-2")}>
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5",
              "text-xs text-muted-foreground",
              "hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-150 ",
              "cursor-pointer group"
            )}
          >
            <span className="h-4">
              <Heart
                type={comment.isLiked ? "solid" : "regular"}
                className={cn(
                  "size-3.5 transition-colors duration-150",
                  comment.isLiked
                    ? "fill-pink-500"
                    : "fill-muted-foreground group-hover:fill-pink-500 dark:group-hover:fill-pink-400"
                )}
              />
            </span>
            {comment.likes > 0 && (
              <span className="text-5">{Format.number(comment.likes)}</span>
            )}
          </button>
          {isOwnComment && (
            <MoreMenu
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Header({
  user,
  updatedAt,
}: Readonly<{
  user: CommentInfo["user"];
  updatedAt: CommentInfo["updatedAt"];
}>) {
  return (
    <div className={cn("flex items-center gap-1", "min-w-0 mb-1")}>
      <HoverCard data={user} className="max-w-[120px] min-w-0">
        <p className={cn("text-sm font-semibold", "truncate")}>
          {user.displayName}
        </p>
      </HoverCard>
      <HoverCard data={user} className="max-w-[100px] min-w-0">
        <p className={cn("text-sm text-muted-foreground", "truncate")}>
          @{user.username}
        </p>
      </HoverCard>
      <Tooltip
        sideOffset={4}
        content={dayjs(updatedAt).format("h:mm A MMM D, YYYY")}
      >
        <p
          className={cn(
            "text-xs text-muted-foreground cursor-default",
            "shrink-0 ml-auto"
          )}
        >
          {Format.date(updatedAt)}
        </p>
      </Tooltip>
    </div>
  );
}

type MoreMenuProps = Readonly<{
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onDelete: () => Promise<void>;
}>;

function MoreMenu({ isDialogOpen, setIsDialogOpen, onDelete }: MoreMenuProps) {
  async function handleDelete() {
    await onDelete();
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
          <DialogTitle>Delete Comment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment?
          </DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-col">
          <button
            type="button"
            onClick={handleDelete}
            className={cn(
              "py-3",
              "flex items-center justify-center",
              "text-destructive hover:bg-destructive/[.12]",
              "cursor-pointer"
            )}
          >
            Delete
          </button>
          <Separator />
          <button
            type="button"
            onClick={() => setIsDialogOpen(false)}
            className={cn(
              "py-3",
              "flex items-center justify-center",
              "hover:bg-accent/[.07]",
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
