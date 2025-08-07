import type { FeedNotificationInfo } from "api";

import { useFeed } from "../../../@modal/(.)feeds/[username]/[id]/hooks/useFeedData";
import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { Format } from "@/utilities";

export default function FeedNotificationList({
  className,
}: Readonly<{ className?: string }>) {
  const { feeds, getCurrentUserId } = useFeed();
  const currentUserId = getCurrentUserId();

  return (
    <div className={cn(className, "flex flex-col")}>
      <h3 className={cn("mb-2 px-4", "font-semibold")}>All feeds</h3>
      <div className="grow pb-4">
        {feeds?.map((feed) => (
          <FeedItem
            key={feed.id}
            data={feed}
            isCurrent={feed.userId === currentUserId}
          />
        ))}
      </div>
    </div>
  );
}

type FeedItemProps = Readonly<{
  data: FeedNotificationInfo;
  isCurrent: boolean;
}>;

function FeedItem({ data, isCurrent }: FeedItemProps) {
  const { setUserId } = useFeed();
  function handleClick() {
    if (isCurrent) return;
    setUserId(data.userId);
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        "px-4 py-2",
        "hover:bg-accent-dark/[.12]",
        "transition-colors duration-150 ease-in-out",
        isCurrent ? "bg-accent-dark/[.12]" : "cursor-pointer"
      )}
      onClick={handleClick}
    >
      <div className="w-[56px]">
        <Avatar
          src={data.avatar}
          alt={`${data.displayName}'s avatar`}
          size="12"
          ring={data.viewed}
          className="mx-auto"
        />
      </div>
      <div className="flex-1">
        <div className="font-semibold">{data.displayName}</div>
        <div className={cn("flex items-center gap-2", "text-sm")}>
          <span className="text-primary-dark">{data.total} new</span>
          <span className="text-muted-foreground-dark">
            {Format.relativeTime(data.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
