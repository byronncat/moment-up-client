import type { FeedNotificationInfo } from "api";

import { usePathname } from "next/navigation";
import { useFeed } from "../hooks/useFeedData";
import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components/common";
import { Format } from "@/utilities";
import { ROUTE } from "@/constants/route";

export default function FeedNotificationList({
  className,
}: Readonly<{ className?: string }>) {
  const { feeds } = useFeed();
  const pathname = usePathname();
  const username = pathname.split("/")[2];

  return (
    <div className={cn(className, "flex flex-col")}>
      <h3 className={cn("mb-2 px-4", "font-semibold")}>All feeds</h3>
      <div className="grow pb-4">
        {feeds?.map((feed) => (
          <FeedItem
            key={feed.id}
            data={feed}
            isCurrent={feed.username === username}
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

export function FeedItem({ data, isCurrent }: FeedItemProps) {
  const { setCurrentUser } = useFeed();
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (isCurrent) {
      event.preventDefault();
      return;
    }
    setCurrentUser(data.username);
  }

  return (
    <Link
      href={ROUTE.FEED(data.username, data.id)}
      onClick={handleClick}
      replace
      className={cn(
        "flex items-center gap-3",
        "px-4 py-2",
        "hover:bg-accent-dark/[.12]",
        "transition-colors duration-150 ease-in-out",
        isCurrent && "bg-accent-dark/[.12] cursor-default"
      )}
    >
      <div className="size-[56px] flex items-center justify-center">
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
    </Link>
  );
}
