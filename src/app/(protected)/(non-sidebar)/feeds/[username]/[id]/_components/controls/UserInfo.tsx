import type { FeedInfo } from "api";

import Link from "next/link";
import { Avatar } from "@/components/common";
import { Format } from "@/utilities";
import { ROUTE } from "@/constants/route";

type UserInfoProps = Readonly<{
  data: FeedInfo["user"];
  timestamp: string;
}>;

export default function UserInfo({ data, timestamp }: UserInfoProps) {
  return (
    <div className="flex items-center gap-2">
      <Link href={ROUTE.PROFILE(data.username)}>
        <Avatar src={data.avatar} alt={data.username} size="10" />
      </Link>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Link href={ROUTE.PROFILE(data.username)}>
            <h2 className="text-sm font-semibold">{data.username}</h2>
          </Link>
          <span className="text-sm text-white/70">
            {Format.relativeTime(timestamp)}
          </span>
        </div>
        <Link href={ROUTE.PROFILE(data.username)}>
          <p className="text-xs text-white/70">@{data.displayName}</p>
        </Link>
      </div>
    </div>
  );
}
