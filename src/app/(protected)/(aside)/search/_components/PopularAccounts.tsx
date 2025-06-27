"use client";

import type { ProfileSearchItem } from "api";
import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Circle } from "@/components/icons";

interface PopularAccountsProps {
  users: ProfileSearchItem[];
  className?: string;
}

export default function PopularAccounts({
  users,
  className,
}: Readonly<PopularAccountsProps>) {
  return (
    users.length > 0 && (
      <div className={className}>
        <Header />
        <div className={cn("grid grid-cols-2", "px-2 gap-2")}>
          {users.map((user) => (
            <UserCard user={user} key={user.id} />
          ))}
        </div>
      </div>
    )
  );
}

function UserCard({ user }: Readonly<{ user: ProfileSearchItem }>) {
  return (
    <div
      className={cn(
        "p-3 h-[192px]",
        "border border-border",
        "rounded-lg relative overflow-hidden"
      )}
    >
      <div className={cn("h-full flex flex-col items-center", "text-center")}>
        <div
          style={{
            backgroundImage: user.backgroundImage
              ? `url(${user.backgroundImage})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={cn("absolute inset-0 h-10")}
        />
        <Avatar src={user.avatar} size="12" />
        <div className={cn("flex items-center gap-1.5", "mt-1")}>
          <p className={cn("font-semibold", "truncate max-w-32")}>
            {user.username}
          </p>
          {user.verified && (
            <Circle variant="check" className="size-3.5 fill-primary" />
          )}
        </div>
        <div className="grow">
          <div className="px-2 text-sm text-muted-foreground line-clamp-2">
            {user.bio || `@${user.username}`}
          </div>
        </div>
        <div className="flex items-center gap-2 w-full mt-3">
          <Button variant="outline" size="sm" className="flex-1/2">
            Follow
          </Button>
          <Button size="sm" className="flex-1/2">
            View
          </Button>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className={cn("flex justify-between items-center", "mb-2 px-4")}>
      <h2 className="font-semibold">Popular accounts</h2>
    </div>
  );
}
