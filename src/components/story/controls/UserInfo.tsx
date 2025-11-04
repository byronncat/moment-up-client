import type { StoryInfo } from "api";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components/common";
import { Format } from "@/utilities";
import { ROUTE } from "@/constants/route";

type UserInfoProps = Readonly<{
  data: StoryInfo["user"] | undefined;
  timestamp: string;
}>;

export default function UserInfo({ data, timestamp }: UserInfoProps) {
  if (!data) return null;
  return (
    <div className={cn("flex items-center gap-2", "min-w-0")}>
      <Link href={ROUTE.PROFILE(data.username)}>
        <Avatar src={data.avatar} alt={data.username} size="10" />
      </Link>
      <div className={cn("flex flex-col", "min-w-0")}>
        <div className="flex items-center gap-2">
          <Link
            href={ROUTE.PROFILE(data.username)}
            className="text-sm font-semibold truncate"
          >
            {data.displayName ?? data.username}
          </Link>
          <span className={cn("text-sm text-white/70", "shrink-0")}>
            {Format.relativeTime(timestamp)}
          </span>
        </div>
        <Link
          href={ROUTE.PROFILE(data.username)}
          className="text-xs text-white/70 truncate"
        >
          @{data.username}
        </Link>
      </div>
    </div>
  );
}
