"use client";

import { mockNotifications } from "@/__mocks__";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/components/icons";

export default function MentionsPage() {
  return mockNotifications.map((notification) => (
    <div
      key={notification.id}
      className={cn("p-4", "border-b border-border", "flex")}
    >
      <div className="mr-3">
        <Avatar className="size-12">
          <AvatarImage
            src={notification.identity.avatar}
            alt={`${notification.identity.name}'s profile`}
            className="object-cover object-top"
          />
          <AvatarFallback className="bg-primary">
            <User className="size-6 fill-card" type="solid" />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="grow min-w-0">
        <div className="font-bold">{notification.identity.name}</div>
        <div className="text-muted-foreground truncate">
          {notification.content}
        </div>
      </div>
    </div>
  ));
}
