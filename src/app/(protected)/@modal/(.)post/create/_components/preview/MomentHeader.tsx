import { __parseImageUrl } from "@/__mocks__";

import { useAuth } from "@/components/providers";
import dayjs from "dayjs";
import Format from "@/utilities/format";

import { cn } from "@/libraries/utils";
import { Avatar, Tooltip } from "@/components/common";
import { MoreHorizontal } from "@/components/icons";

type PostHeaderProps = Readonly<{
  className?: string;
}>;

export default function PostHeader({ className }: PostHeaderProps) {
  const { user } = useAuth();

  if (!user) return null;
  return (
    <div className={cn("flex gap-2", className)}>
      <Avatar
        src={__parseImageUrl(user.avatar, 120, 120)}
        alt={`${user.displayName ?? user.username} avatar`}
        size="12"
      />

      <div className={cn("flex flex-col", "mt-1 flex-1")}>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "font-semibold text-base/tight",
              "truncate max-w-[192px] md:max-w-[320px]"
            )}
          >
            {user.displayName}
          </span>
          <span className="text-base/tight text-muted-foreground">·</span>
          <Tooltip
            sideOffset={4}
            content={dayjs(new Date()).format("h:mm A MMM D, YYYY")}
          >
            <span className="text-sm/tight text-muted-foreground cursor-default">
              {Format.date(new Date())}
            </span>
          </Tooltip>
        </div>
        <span
          className={cn(
            "text-sm text-muted-foreground",
            "truncate max-w-[192px] md:max-w-[320px]"
          )}
        >
          @{user.username}
        </span>
      </div>

      <div className="size-8 text-muted-foreground">
        <MoreHorizontal className="size-5" />
        <span className="sr-only">More options</span>
      </div>
    </div>
  );
}
