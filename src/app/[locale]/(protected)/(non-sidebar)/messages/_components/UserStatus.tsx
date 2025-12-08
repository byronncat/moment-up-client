import type { UserStatusDto } from "api";

import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";

type UserStatusProps = Readonly<{
  userStatuses: UserStatusDto[];
  className?: string;
}>;

export default function UserStatus({
  userStatuses,
  className,
}: UserStatusProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5",
        "overflow-x-auto scrollbar-hide",
        className
      )}
    >
      {userStatuses.map((user) => (
        <div key={user.id} className="flex flex-col items-center gap-1">
          <div className="relative">
            <Avatar src={user.avatar} alt={user.name} size="12" />
            <span
              className={cn(
                "absolute bottom-0 right-0",
                "size-3 bg-green-500 rounded-full",
                "border-2 border-background",
                user.isActive && "bg-green-500"
              )}
            />
          </div>

          <span
            className={cn(
              "text-xs text-muted-foreground",
              "truncate max-w-14",
              "text-center",
              user.isActive && "text-foreground"
            )}
          >
            {user.name}
          </span>
        </div>
      ))}
    </div>
  );
}
