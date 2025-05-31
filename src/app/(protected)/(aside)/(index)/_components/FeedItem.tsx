import type { FeedNotification } from "api";
import { ROUTE } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "@/components/icons";
import { toast } from "sonner";

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

export function CreateFeedButton({
  className,
}: Readonly<{
  className?: string;
}>) {
  return (
    <button
      type="button"
      className={cn("relative group", "cursor-pointer", className)}
    >
      <div className={cn("flex items-center justify-center", "size-18")}>
        <div
          className={cn(
            "size-16 rounded-full bg-primary/20",
            "flex items-center justify-center",
            "border-2 border-primary",
            "transition-all duration-200",
            "group-hover:scale-105 group-hover:border-primary/70"
          )}
        >
          <Plus className="size-6 text-card-foreground fill-primary" />
        </div>
      </div>
      <span
        className={cn(
          "text-xs font-semibold",
          "inline-block",
          "max-w-16 truncate text-center",
          "transition-colors group-hover:text-primary"
        )}
      >
        Create
      </span>
    </button>
  );
}

export function FeedItemSkeleton() {
  return (
    <div className={cn("flex flex-col items-center", "h-24")}>
      <div className={cn("flex items-center justify-center", "size-18")}>
        <Skeleton className="size-16 rounded-full" />
      </div>
      <Skeleton className="w-16 h-3 mt-0.5" />
    </div>
  );
}
