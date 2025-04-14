"use client";

import { mockSuggestedUsers } from "@/__mocks__";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/components/icons";

export default function SuggestedUsers() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-muted-foreground">
          Suggested for you
        </span>
        <button
          className={cn(
            "text-xs font-semibold",
            "cursor-pointer hover:opacity-60",
            "transition-opacity duration-150 ease-in-out"
          )}
        >
          See all
        </button>
      </div>
      <div className="space-y-4">
        {mockSuggestedUsers.map(
          (user: {
            id: number;
            username: string;
            avatar: string;
            followedBy: string;
          }) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.username}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary">
                    <User className="size-4 fill-card" type="solid" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <Link
                    href={`/profile/${user.username}`}
                    className={cn(
                      "text-sm font-semibold",
                      "hover:opacity-60",
                      "transition-opacity duration-150 ease-in-out"
                    )}
                  >
                    {user.username}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    Followed by {user.followedBy}
                  </span>
                </div>
              </div>
              <button
                className={cn(
                  "text-xs font-semibold text-primary",
                  "cursor-pointer hover:text-primary/80",
                  "transition-colors duration-150 ease-in-out"
                )}
              >
                Follow
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
