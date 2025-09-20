"use client";

import type { FeedItemDto } from "api";
import type { Actions } from "../../providers/MomentStorage";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/route";

import ColorfulIconButton, {
  buttonStyles,
} from "../../common/ColorfulIconButton";
import ShareDialog from "./share-dialog";
import { Heart, Message, Share, Repeat, Bookmark } from "../../icons";

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
  const momentId = data.id;
  const user = data.user;
  const post = data.post;

  const buttons = [
    {
      icon: (
        <Heart
          type={post.isLiked ? "solid" : "regular"}
          className={cn(
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
      tooltip: "Like",
      isActive: post.isLiked,
      onClick: () => actions.like(momentId),
    },
    {
      icon: (
        <Message
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-sky-500",
            "translate-x-[1px]"
          )}
        />
      ),
      color: "sky" as const,
      count: post.comments,
      tooltip: "Comment",
      onClick: () =>
        actions.comment
          ? actions.comment()
          : router.push(ROUTE.POST(momentId)),
    },
    {
      icon: (
        <Repeat
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-green-500"
          )}
        />
      ),
      color: "green" as const,
      count: post.reposts,
      tooltip: "Repost",
      onClick: () => setIsShareDialogOpen(true),
    },
    {
      icon: (
        <Bookmark
          type={post.isBookmarked ? "solid" : "regular"}
          className={cn(
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
      onClick: () => actions.bookmark(momentId),
    },
    {
      icon: (
        <Share
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-blue-500"
          )}
        />
      ),
      color: "blue" as const,
      tooltip: "Share",
      onClick: () => actions.share(momentId),
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
          {buttons.slice(0, 3).map((button) => (
            <ColorfulIconButton key={button.tooltip} {...button} />
          ))}

          <div className="flex items-center gap-1">
            {buttons.slice(3).map((button) => (
              <ColorfulIconButton key={button.tooltip} {...button} />
            ))}
          </div>
        </div>
      </div>

      <ShareDialog
        momentId={momentId}
        userData={user}
        open={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
      />
    </>
  );
}
