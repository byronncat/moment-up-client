"use client";

import type { FeedItemDto } from "api";
import type { Actions } from "../../providers/PostStorage";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/route";

import ColorfulIconButton, {
  buttonStyles,
} from "../../common/ColorfulIconButton";
import ShareDialog from "./share-dialog";
import { Bookmark, Heart, Message, Repeat, Share } from "../../icons";

type ButtonGroupProps = Readonly<{
  data: FeedItemDto;
  actions: Pick<Actions, "like" | "bookmark" | "share"> & {
    comment?: () => void;
  };
  className?: string;
}>;

export default function ButtonGroup({
  data,
  actions,
  className,
}: ButtonGroupProps) {
  const router = useRouter();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const postId = data.id;
  const { user, post } = data;

  const buttons = [
    {
      icon: (
        <Heart
          type={post.isLiked ? "solid" : "regular"}
          className={cn(
            "group-focus:fill-pink-500 dark:group-focus:fill-pink-400",
            buttonStyles.iconSize,
            buttonStyles.transition,
            post.isLiked
              ? "fill-pink-500"
              : "fill-muted-foreground group-hover:fill-pink-500"
          )}
        />
      ),
      color: "pink" as const,
      count: post.likes,
      emptyText: "Likes",
      tooltip: "Like",
      isActive: post.isLiked,
      onClick: () => actions.like(postId),
    },
    {
      icon: (
        <Message
          className={cn(
            "group-focus:fill-sky-500 dark:group-focus:fill-sky-400",
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-sky-500",
            "translate-x-px"
          )}
        />
      ),
      color: "sky" as const,
      count: post.comments,
      emptyText: "Comments",
      tooltip: "Comment",
      onClick: () =>
        actions.comment ? actions.comment() : router.push(ROUTE.POST(postId)),
    },
    {
      icon: (
        <Repeat
          className={cn(
            "group-focus:fill-green-500 dark:group-focus:fill-green-400",
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-green-500"
          )}
        />
      ),
      color: "green" as const,
      count: post.reposts,
      emptyText: "Reposts",
      tooltip: "Repost",
      onClick: () => setIsShareDialogOpen(true),
    },
    {
      icon: (
        <Bookmark
          type={post.isBookmarked ? "solid" : "regular"}
          className={cn(
            "group-focus:fill-yellow-500 dark:group-focus:fill-yellow-400",
            buttonStyles.iconSize,
            buttonStyles.transition,
            post.isBookmarked
              ? "fill-yellow-500"
              : "fill-muted-foreground group-hover:fill-yellow-500"
          )}
        />
      ),
      color: "yellow" as const,
      tooltip: "Bookmark",
      isActive: post.isBookmarked,
      onClick: () => actions.bookmark(postId),
    },
    {
      icon: (
        <Share
          className={cn(
            "group-focus:fill-blue-500 dark:group-focus:fill-blue-400",
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-blue-500"
          )}
        />
      ),
      color: "blue" as const,
      tooltip: "Share",
      onClick: () => actions.share(postId),
    },
  ];

  return (
    <>
      <div className={cn("px-4 py-3", className)}>
        <div
          className={cn(
            "flex items-center justify-between",
            "w-full",
            "text-muted-foreground"
          )}
        >
          <ColorfulIconButton {...buttons[0]} className="grow" />
          <ColorfulIconButton {...buttons[1]} className="grow" />
          <ColorfulIconButton {...buttons[2]} className="grow" />

          <div className="flex items-center gap-1 w-fit">
            {buttons.slice(3).map((button) => (
              <ColorfulIconButton key={button.tooltip} {...button} />
            ))}
          </div>
        </div>
      </div>

      <ShareDialog
        momentId={postId}
        userData={user}
        open={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
      />
    </>
  );
}
