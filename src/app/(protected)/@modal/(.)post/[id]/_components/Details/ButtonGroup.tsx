import type { PostDto, UserSummaryDto } from "api";
import type { Actions } from "@/components/providers/PostStorage";
import { useState } from "react";

import { cn } from "@/libraries/utils";
import { ColorfulIconButton, buttonStyles } from "@/components/common";
import ShareDialog from "@/components/post/feed/share-dialog";
import { Bookmark, Heart, Message, Repeat, Share } from "@/components/icons";

type ButtonsProps = Readonly<{
  postData: PostDto;
  momentId: string;
  className?: string;
}>;

type FirstGroupProps = ButtonsProps &
  Readonly<{
    userData: UserSummaryDto;
    actions: Pick<Actions, "like" | "bookmark" | "share">;
    onCommentClick?: () => void;
  }>;

function FirstGroup({
  postData: data,
  momentId,
  userData,
  className,
  actions,
  onCommentClick,
}: FirstGroupProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const buttons = [
    {
      icon: (
        <Heart
          type={data.isLiked ? "solid" : "regular"}
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            data.isLiked
              ? "fill-pink-500"
              : "fill-muted-foreground group-hover:fill-pink-500 dark:group-hover:fill-pink-400 group-focus:fill-pink-500 dark:group-focus:fill-pink-400"
          )}
        />
      ),
      color: "pink" as const,
      count: data.likes,
      emptyText: "Likes",
      tooltip: "Like",
      isActive: data.isLiked,
      onClick: () => actions.like(momentId),
    },
    {
      icon: (
        <Message
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-sky-500 dark:group-hover:fill-sky-400 group-focus:fill-sky-500 dark:group-focus:fill-sky-400",
            "translate-x-[1px]"
          )}
        />
      ),
      color: "sky" as const,
      count: data.comments,
      emptyText: "Comments",
      tooltip: "Comment",
      onClick: onCommentClick,
    },
    {
      icon: (
        <Repeat
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-green-500 dark:group-hover:fill-green-400 group-focus:fill-green-500 dark:group-focus:fill-green-400"
          )}
        />
      ),
      color: "green" as const,
      count: 73,
      emptyText: "Reposts",
      tooltip: "Repost",
      onClick: () => setIsShareDialogOpen(true),
    },
  ];

  return (
    <>
      <div className={cn("flex gap-2", "border-y border-border", className)}>
        {buttons.map((button) => (
          <div key={button.tooltip} className="flex-1 flex justify-center">
            <ColorfulIconButton {...button} />
          </div>
        ))}
      </div>

      <ShareDialog
        momentId={momentId}
        userData={userData}
        open={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
      />
    </>
  );
}

type SecondGroupProps = ButtonsProps &
  Readonly<{
    actions: Pick<Actions, "bookmark" | "share">;
  }>;

function SecondGroup({
  postData: data,
  momentId,
  className,
  actions,
}: SecondGroupProps) {
  const buttons = [
    {
      icon: (
        <Bookmark
          type={data.isBookmarked ? "solid" : "regular"}
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            data.isBookmarked
              ? "fill-yellow-500"
              : "fill-muted-foreground group-hover:fill-yellow-500 dark:group-hover:fill-yellow-400 group-focus:fill-yellow-500 dark:group-focus:fill-yellow-400"
          )}
        />
      ),
      color: "yellow" as const,
      tooltip: "Bookmark",
      isActive: data.isBookmarked,
      onClick: () => actions.bookmark(momentId),
    },
    {
      icon: (
        <Share
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-blue-500 dark:group-hover:fill-blue-400 group-focus:fill-blue-500 dark:group-focus:fill-blue-400"
          )}
        />
      ),
      color: "blue" as const,
      tooltip: "Share",
      onClick: () => actions.share(momentId),
    },
  ];

  return (
    <div className={cn("flex justify-end", className)}>
      {buttons.map((button) => (
        <ColorfulIconButton {...button} key={button.tooltip} />
      ))}
    </div>
  );
}

const ButtonGroup = {
  FirstGroup,
  SecondGroup,
};

export default ButtonGroup;
