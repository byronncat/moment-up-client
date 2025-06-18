import type { FeedNotification } from "api";
import { ROUTE } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components";

export default function FeedItem({
  data,
  className,
}: Readonly<{
  data: FeedNotification;
  className?: string;
}>) {
  return (
    <div className={className}>
      <Link
        href={ROUTE.FEED(data.id)}
        className={cn("group", "cursor-pointer", "flex flex-col items-center")}
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
      </Link>
    </div>
  );
}
