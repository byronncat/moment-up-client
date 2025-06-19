import type { MomentInfo, UserCardDisplayInfo } from "api";
import type { Actions } from "@/components/providers/MomentData";
import { useState } from "react";

import { cn } from "@/libraries/utils";
import { ColorfulIconButton, buttonStyles } from "@/components";
import { Heart, Comment, Share, Repeat, Bookmark } from "@/components/icons";
import ShareDialog from "@/components/moment/moment-card/ShareDialog";

type ButtonsProps = Readonly<{
  postData: MomentInfo;
  momentId: string;
  className?: string;
  actions: Actions;
}>;

type FirstGroupProps = ButtonsProps &
  Readonly<{
    userData: UserCardDisplayInfo;
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
              : "fill-muted-foreground group-hover:fill-pink-500 dark:group-hover:fill-pink-400"
          )}
        />
      ),
      color: "pink-500",
      count: data.likes,
      tooltip: "Like",
      isActive: data.isLiked,
      onClick: () => actions.like(momentId),
    },
    {
      icon: (
        <Comment
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-sky-500 dark:group-hover:fill-sky-400",
            "translate-x-[1px]"
          )}
        />
      ),
      color: "sky-500",
      count: data.comments,
      tooltip: "Comment",
      onClick: onCommentClick,
    },
    {
      icon: (
        <Repeat
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-green-500 dark:group-hover:fill-green-400"
          )}
        />
      ),
      color: "green-500",
      count: 73,
      tooltip: "Repost",
      onClick: () => setIsShareDialogOpen(true),
    },
  ];

  return (
    <>
      <div
        className={cn("flex gap-2", "py-1 border-y border-border", className)}
      >
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
        onOpenChange={setIsShareDialogOpen}
      />
    </>
  );
}

function SecondGroup({
  postData: data,
  momentId,
  className,
  actions,
}: ButtonsProps) {
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
              : "fill-muted-foreground group-hover:fill-yellow-500 dark:group-hover:fill-yellow-400"
          )}
        />
      ),
      color: "yellow-500",
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
            "fill-muted-foreground group-hover:fill-blue-500 dark:group-hover:fill-blue-400"
          )}
        />
      ),
      color: "blue-500",
      tooltip: "Share",
      onClick: () => actions.share(momentId),
    },
  ];

  return (
    <div className={cn("flex justify-end gap-2", "py-1 pr-2", className)}>
      {buttons.map((button) => (
        <div key={button.tooltip}>
          <ColorfulIconButton {...button} />
        </div>
      ))}
    </div>
  );
}

const ButtonGroup = {
  FirstGroup,
  SecondGroup,
};

export default ButtonGroup;
