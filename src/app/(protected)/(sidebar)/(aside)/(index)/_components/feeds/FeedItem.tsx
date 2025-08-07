import type { FeedNotificationInfo } from "api";

import { useFeed } from "@/app/(protected)/@modal/(.)feeds/[username]/[id]/hooks/useFeedData";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components/common";

export default function FeedItem({
  data,
  className,
}: Readonly<{
  data: FeedNotificationInfo;
  className?: string;
}>) {
  const { setCurrentUser } = useFeed();
  return (
    <div className={className}>
      <Link
        href={ROUTE.FEED(data.username, data.id)}
        onClick={() => setCurrentUser(data.username)}
        className={cn("group", "cursor-pointer", "flex flex-col items-center")}
        aria-label={`View feed from ${data.displayName}${!data.viewed ? " (unread)" : ""}`}
        aria-describedby={`feed-${data.id}-status`}
      >
        <div className={cn("flex items-center justify-center", "size-18")}>
          <Avatar
            src={data.avatar}
            alt={`${data.displayName}'s avatar`}
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
          {data.displayName}
        </span>
        <span id={`feed-${data.id}-status`} className="sr-only">
          {data.viewed ? "Read" : "Unread"} feed
        </span>
      </Link>
    </div>
  );
}
