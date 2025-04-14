"use client";

import { mockCurrentUser } from "@/__mocks__";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/components/icons";

export default function SwitchAccount() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-11">
            <AvatarImage
              src={mockCurrentUser.avatar}
              alt="Your profile picture"
              className="object-cover"
            />
            <AvatarFallback className="bg-primary">
              <User className="size-6 fill-card" type="solid" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Link
              href="/profile/me"
              className={cn(
                "text-sm font-semibold",
                "hover:opacity-60",
                "transition-opacity duration-150 ease-in-out"
              )}
            >
              {mockCurrentUser.username}
            </Link>
            <span className="text-sm text-muted-foreground">
              {mockCurrentUser.name}
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
          Switch
        </button>
      </div>
    </div>
  );
}
