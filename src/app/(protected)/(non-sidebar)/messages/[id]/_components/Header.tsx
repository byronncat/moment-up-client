"use client";

import type { ContactDto } from "api";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/common";
import { Phone, Video, Circle, User } from "@/components/icons";

type HeaderProps = Readonly<{
  contact?: ContactDto;
}>;

export default function Header({ contact }: HeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "px-4 py-3 border-b border-border"
      )}
    >
      <HeaderLeft contact={contact} />
      <HeaderRight />
    </div>
  );
}

function HeaderLeft({ contact }: HeaderProps) {
  return (
    <div className="flex items-center">
      <Avatar
        src={contact?.avatar}
        alt={contact?.name}
        size="12"
        className="mr-3"
      />
      <div>
        <h2 className={cn("font-semibold text-lg", "flex items-center")}>
          {contact?.name}
          {contact?.isActive && (
            <span
              className={cn(
                "ml-2 size-2 rounded-full inline-block",
                "bg-green-500"
              )}
            />
          )}
        </h2>
        <p className="text-xs text-muted-foreground">
          Typically replies within a few hours
        </p>
      </div>
    </div>
  );
}

function HeaderRight() {
  return (
    <div className="flex space-x-2">
      <Button variant="ghost" size="icon" className="rounded-full">
        <Phone className="size-4 fill-muted-foreground" />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Video className="size-4 fill-muted-foreground" />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Circle variant="info" className="size-4 fill-muted-foreground" />
      </Button>
    </div>
  );
}
