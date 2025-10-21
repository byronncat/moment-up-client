import type { StoryNotificationInfo } from "api";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components/common";
import { ROUTE } from "@/constants/route";

export default function StoryItem({
  data,
  className,
}: Readonly<{
  data: StoryNotificationInfo;
  className?: string;
}>) {
  return (
    <div className={className}>
      <Link
        href={ROUTE.STORY(data.username, data.id)}
        className={cn(
          "group",
          "cursor-pointer focus-within-indicator rounded-sm",
          "flex flex-col items-center"
        )}
        aria-label={`View story from ${data.displayName ?? data.username}${!data.viewed ? " (unread)" : ""}`}
        aria-describedby={`story-${data.id}-status`}
      >
        <div className={cn("flex items-center justify-center", "size-18")}>
          <Avatar
            src={data.avatar}
            alt={`${data.displayName ?? data.username}'s avatar`}
            size="14"
            ring={data.viewed}
            className={cn(
              "transition-all duration-200",
              "group-hover:scale-105 group-hover:border-primary/70"
            )}
          />
        </div>
        <span
          className={cn(
            "text-xs font-semibold",
            "inline-block",
            "max-w-16 truncate text-center",
            "transition-colors group-hover:text-primary"
          )}
        >
          {data.displayName ?? data.username}
        </span>
        <span id={`story-${data.id}-status`} className="sr-only">
          {data.viewed ? "Read" : "Unread"} story
        </span>
      </Link>
    </div>
  );
}
