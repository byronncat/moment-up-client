"use client";

import type { CommentInfo } from "api";

import { useRef, useState } from "react";
import { useTextClamp } from "@/hooks";
import { useComment } from "./provider/CommentData";
import dayjs from "dayjs";
import format from "@/utilities/format";
import { toast } from "sonner";
import { CoreApi } from "@/services";
import { SortBy } from "@/constants/clientConfig";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar, UserInfoCard, Tooltip } from "@/components/common";
import { Heart } from "@/components/icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Chevron } from "@/components/icons";
import { CommentSkeleton } from "./CommentSkeletons";

const sortOptions = [
  {
    value: SortBy.MOST_LIKED,
    label: "Most liked",
    description: "Prioritize with the most likes.",
  },
  {
    value: SortBy.NEWEST,
    label: "Newest",
    description: "Show the most recent at the top.",
  },
];

type CommentZoneProps = Readonly<{
  className?: string;
}>;

export default function CommentZone({ className }: CommentZoneProps) {
  const {
    comments,
    loading,
    sort,
    sortBy,
    isExpanded,
    toggleExpansion,
    hasNextPage,
    fetchMore,
  } = useComment();

  return (
    <div className={cn("px-4 py-3", className)}>
      <SortByDropdown sort={sort} handleSortChange={sortBy} className="mb-4" />
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isExpanded={isExpanded(comment.id)}
            onToggleExpand={() => toggleExpansion(comment.id)}
          />
        ))}
        {loading && (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        )}
      </div>
      {!loading && hasNextPage && (
        <button
          onClick={fetchMore}
          className={cn(
            "mt-3",
            "text-sm text-muted-foreground font-semibold",
            "cursor-pointer hover:underline"
          )}
        >
          Load more...
        </button>
      )}
    </div>
  );
}

type SortByDropdownProps = Readonly<{
  sort: SortBy;
  handleSortChange: (value: SortBy) => void;
  className?: string;
}>;

function SortByDropdown({
  sort,
  handleSortChange,
  className,
}: SortByDropdownProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1",
              "text-sm text-muted-foreground font-semibold",
              "cursor-pointer"
            )}
          >
            {sortOptions.find((option) => option.value === sort)?.label}
            <Chevron direction="down" className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-2">
          <div className="space-y-1">
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(value) => handleSortChange(value as SortBy)}
            >
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function CommentItem({
  comment,
  isExpanded,
  onToggleExpand,
}: Readonly<{
  comment: CommentInfo;
  isExpanded: boolean;
  onToggleExpand: () => void;
}>) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const isTextClamped = useTextClamp(textRef);
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likes);

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

  return (
    <div className="flex items-start gap-2">
      <CommentHoverCard user={comment.user}>
        <Avatar src={comment.user.avatar} size="12" />
      </CommentHoverCard>
      <div className="flex flex-col flex-1">
        <div className={cn("flex items-center gap-1", "min-w-0")}>
          <CommentHoverCard
            user={comment.user}
            className="max-w-[120px] min-w-0"
          >
            <p className={cn("text-sm font-semibold", "truncate")}>
              {comment.user.displayName}
            </p>
          </CommentHoverCard>
          <CommentHoverCard
            user={comment.user}
            className="max-w-[100px] min-w-0"
          >
            <p className={cn("text-sm text-muted-foreground", "truncate")}>
              @{comment.user.username}
            </p>
          </CommentHoverCard>
          <Tooltip
            content={dayjs(comment.createdAt).format("h:mm A MMM D, YYYY")}
          >
            <p
              className={cn(
                "text-xs text-muted-foreground cursor-default",
                "shrink-0 ml-auto"
              )}
            >
              {format.date(comment.createdAt)}
            </p>
          </Tooltip>
        </div>

        <p
          ref={textRef}
          className={cn("text-sm", !isExpanded && "line-clamp-3")}
        >
          {comment.content}
        </p>

        <div className={cn("pt-1", "flex flex-col gap-2")}>
          {isTextClamped && !isExpanded && (
            <button
              onClick={onToggleExpand}
              className={cn(
                "font-semibold text-xs text-muted-foreground",
                "cursor-pointer hover:underline",
                "transition-opacity duration-150",
                "text-left",
                "flex items-center gap-1"
              )}
            >
              Show more
            </button>
          )}
          {isExpanded && (
            <button
              onClick={onToggleExpand}
              className={cn(
                "font-semibold text-xs text-muted-foreground",
                "cursor-pointer hover:underline",
                "transition-opacity duration-150",
                "text-left",
                "flex items-center gap-1"
              )}
            >
              Show less
            </button>
          )}
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
                type={isLiked ? "solid" : "regular"}
                className={cn(
                  "size-3.5 transition-colors duration-150",
                  isLiked
                    ? "fill-pink-500"
                    : "fill-muted-foreground group-hover:fill-pink-500 dark:group-hover:fill-pink-400"
                )}
              />
            </span>
            {likeCount > 0 && <span>{format.number(likeCount)}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentHoverCard({
  children,
  user,
  className,
}: Readonly<{
  children: React.ReactNode;
  user: CommentInfo["user"];
  className?: string;
}>) {
  const UserCardDisplayInfo = {
    ...user,
  };

  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn(
          "inline-flex",
          "hover:opacity-80 transition-opacity duration-150 ease-in-out",
          className
        )}
        asChild
      >
        <Link
          href={ROUTE.PROFILE(user.username)}
          className={cn("min-w-0", className)}
        >
          {children}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-[288px]">
        <UserInfoCard user={UserCardDisplayInfo} />
      </HoverCardContent>
    </HoverCard>
  );
}
