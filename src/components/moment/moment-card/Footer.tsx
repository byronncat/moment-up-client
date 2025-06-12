"use client";

import { cn } from "@/libraries/utils";
import format from "@/utilities/format";
import { useData } from "./provider/Data";

import { CardFooter } from "../../ui/card";

import Tooltip from "../../common/Tooltip";
import { Heart, Comment, Share, Repeat, Bookmark } from "../../icons";

const buttonStyles = {
  iconSize: "size-5",
  transition: "transition-colors duration-150 ease-in-out",
};

export default function Footer() {
  const { postData: post, like, bookmark } = useData();

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
      color: "pink-500",
      count: post.likes,
      tooltip: "Like",
      isActive: post.isLiked,
      onClick: like,
    },
    {
      icon: (
        <Comment
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-sky-500",
            "translate-x-[1px]"
          )}
        />
      ),
      color: "sky-500",
      count: post.comments,
      tooltip: "Comment",
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
      color: "green-500",
      count: 73,
      tooltip: "Repost",
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
              : "fill-muted-foreground group-hover:fill-yellow-500",
          )}
        />
      ),
      color: "yellow-500",
      tooltip: "Bookmark",
      isActive: post.isBookmarked,
      onClick: bookmark,
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
      color: "blue-500",
      tooltip: "Share",
    },
  ];

  return (
    <CardFooter className="p-3">
      <div
        className={cn(
          "flex items-center justify-between",
          "w-full",
          "text-muted-foreground"
        )}
      >
        {buttons.slice(0, 3).map((button) => (
          <ActionButton key={button.tooltip} {...button} />
        ))}

        <div className="flex items-center gap-1">
          {buttons.slice(3).map((button) => (
            <ActionButton key={button.tooltip} {...button} />
          ))}
        </div>
      </div>
    </CardFooter>
  );
}

type ActionButtonProps = {
  icon: React.ReactNode;
  color: string;
  tooltip: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
};

function ActionButton({
  icon,
  color,
  count,
  tooltip,
  isActive = false,
  onClick,
}: ActionButtonProps) {
  let textClass = "";
  let hoverTextClass = "";
  let bgHoverClass = "";
  switch (color) {
    case "pink-500":
      textClass = "text-pink-500";
      hoverTextClass = "hover:text-pink-500";
      bgHoverClass = "group-hover:bg-pink-500/10";
      break;
    case "sky-500":
      textClass = "text-sky-500";
      hoverTextClass = "hover:text-sky-500";
      bgHoverClass = "group-hover:bg-sky-500/10";
      break;
    case "green-500":
      textClass = "text-green-500";
      hoverTextClass = "hover:text-green-500";
      bgHoverClass = "group-hover:bg-green-500/10";
      break;
    case "yellow-500":
      textClass = "text-yellow-500";
      hoverTextClass = "hover:text-yellow-500";
      bgHoverClass = "group-hover:bg-yellow-500/10";
      break;
    case "blue-500":
      textClass = "text-blue-500";
      hoverTextClass = "hover:text-blue-500";
      bgHoverClass = "group-hover:bg-blue-500/10";
      break;
    default:
      textClass = "";
      hoverTextClass = "";
      bgHoverClass = "";
  }

  return (
    <Tooltip content={tooltip} sideOffset={6}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex items-center gap-1",
          isActive ? textClass : hoverTextClass,
          "cursor-pointer",
          buttonStyles.transition
        )}
      >
        <div
          className={cn(
            "p-2 rounded-full",
            bgHoverClass,
            buttonStyles.transition
          )}
        >
          {icon}
        </div>
        {count && <span>{format.number(count)}</span>}
      </button>
    </Tooltip>
  );
}
