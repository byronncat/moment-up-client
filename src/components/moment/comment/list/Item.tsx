import type { CommentInfo } from "api";

import { useEffect, useRef, useState } from "react";
import { useTextClamp } from "@/hooks";
import dayjs from "dayjs";
import Format from "@/utilities/format";
import { toast } from "sonner";
import { CoreApi } from "@/services";

import { cn } from "@/libraries/utils";
import { Avatar, Tooltip } from "@/components/common";
import { Heart } from "@/components/icons";
import HoverCard from "./HoverCard";

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
  const textRef = useRef<HTMLParagraphElement>(null);
  const isTextClamped = useTextClamp(textRef);
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [canExpand, setCanExpand] = useState(false);
  const isFirstRender = useRef(true);

  async function handleLike() {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    const res = await CoreApi.toggleCommentLike(comment.id);
    if (!res.success) {
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      toast.error("Something went wrong!");
    }
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

        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 pt-2",
            "text-xs text-muted-foreground",
            "hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-150 ",
            "cursor-pointer group"
          )}
        >
          <span className="h-4">
            <Heart
              type={isLiked ? "solid" : "regular"}
              className={cn(
                "size-3.5 transition-colors duration-150",
                isLiked
                  ? "fill-pink-500"
                  : "fill-muted-foreground group-hover:fill-pink-500 dark:group-hover:fill-pink-400"
              )}
            />
          </span>
          {likeCount > 0 && <span>{Format.number(likeCount)}</span>}
        </button>
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
