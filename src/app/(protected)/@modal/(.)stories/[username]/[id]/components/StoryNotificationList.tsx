import type { StoryNotificationInfo } from "api";

import { usePathname } from "next/navigation";
import { useStory } from "@/components/providers";
import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components/common";
import { Format } from "@/utilities";
import { ROUTE } from "@/constants/route";

export default function StoryNotificationList({
  className,
}: Readonly<{ className?: string }>) {
  const { otherStories: stories } = useStory();
  const pathname = usePathname();
  const username = pathname.split("/")[2];

  return (
    <div className={cn(className, "flex flex-col")}>
      <h3 className={cn("mb-2 px-4", "font-semibold")}>All stories</h3>
      <div className="grow pb-4">
        {stories?.map((story) => (
          <StoryItem
            key={story.id}
            data={story}
            isCurrent={story.username === username}
          />
        ))}
      </div>
    </div>
  );
}

type StoryItemProps = Readonly<{
  data: StoryNotificationInfo;
  isCurrent: boolean;
}>;

export function StoryItem({ data, isCurrent }: StoryItemProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (isCurrent) event.preventDefault();
  }

  return (
    <Link
      href={ROUTE.STORY(data.username, data.id)}
      onClick={handleClick}
      replace
      className={cn(
        "flex items-center gap-3",
        "px-4 py-2",
        "hover:bg-accent-dark/12",
        "transition-colors duration-150 ease-in-out",
        isCurrent && "bg-accent-dark/12 cursor-default"
      )}
    >
      <div className="size-[56px] flex items-center justify-center">
        <Avatar
          src={data.avatar}
          alt={`${data.displayName}'s avatar`}
          size="14"
          ring={data.viewed}
          className="mx-auto"
        />
      </div>

      <div className="flex-1">
        <div className="font-semibold">{data.displayName ?? data.username}</div>
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
