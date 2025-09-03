"use client";

import { type Contact } from "@/__mocks__";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video, Circle, User } from "@/components/icons";

type HeaderProps = {
  contact?: Contact;
};

export default function Header({ contact }: HeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "p-4 border-b border-border"
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
      <Avatar className="size-12 mr-3">
        <AvatarImage
          src={contact?.avatar || undefined}
          alt={contact?.name}
          className="object-cover object-top"
        />
        <AvatarFallback className="bg-primary">
          <User className="size-6 fill-card" type="solid" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className={cn("font-semibold text-lg", "flex items-center")}>
          {contact?.name}
          {contact?.isActive && (
            <span
              className={cn(
                "ml-2 size-2 rounded-full inline-block",
                "bg-green-500"
              )}
            ></span>
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
      <Button variant="ghost" size="icon">
        <Phone className="size-5 fill-muted-foreground" />
      </Button>
      <Button variant="ghost" size="icon">
        <Video className="size-5 fill-muted-foreground" />
      </Button>
      <Button variant="ghost" size="icon">
        <Circle variant="info" className="size-5 fill-muted-foreground" />
      </Button>
    </div>
  );
}
