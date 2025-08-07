import type { AccountInfo } from "api";
import Link from "next/link";
import { Avatar } from "@/components/common";
import { ROUTE } from "@/constants/route";

type UserInfoProps = Readonly<{
  data: AccountInfo;
}>;

export default function UserInfo({ data }: UserInfoProps) {
  return (
    <div className="flex items-center gap-2">
      <Link href={ROUTE.PROFILE(data.username)}>
        <Avatar src={data.avatar} alt={data.username} size="10" />
      </Link>
      <div className="flex flex-col">
        <Link href={ROUTE.PROFILE(data.username)}>
          <h2 className="font-semibold inline-block">{data.username}</h2>
        </Link>
        <Link href={ROUTE.PROFILE(data.username)}>
          <p className="text-xs text-white/70">@{data.displayName}</p>
        </Link>
      </div>
    </div>
  );
}
