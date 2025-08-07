import type { FeedNotificationInfo } from "api";

import { useFeed } from "../../../@modal/(.)feeds/[username]/[id]/hooks/useFeedData";
import dayjs from "dayjs";
import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";

export default function FeedNotificationList({
  className,
}: Readonly<{ className?: string }>) {
  const { feeds } = useFeed();

  return (
    <div className={cn(className, "flex flex-col")}>
      <h3 className={cn("mb-2 px-4", "font-semibold")}>All feeds</h3>
      <div className="grow pb-4">
        {feeds?.map((feed) => (
          <FeedItem key={feed.id} data={feed} />
        ))}
      </div>
    </div>
  );
}

function FeedItem({ data }: Readonly<{ data: FeedNotificationInfo }>) {
  const { setUserId } = useFeed();

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        "px-4 py-2",
        "hover:bg-accent-dark/[.12] cursor-pointer",
        "transition-colors duration-150 ease-in-out"
      )}
      onClick={() => setUserId(data.userId)}
    >
      <Avatar
        src={data.avatar}
        alt={`${data.displayName}'s avatar`}
        size="12"
        ring={data.viewed}
      />
      <div className="flex-1">
        <div className="font-semibold">{data.displayName}</div>
        <div className="text-sm text-muted-foreground">
          <span>{dayjs(data.createdAt).fromNow()}</span>
        </div>
      </div>
    </div>
  );
}
