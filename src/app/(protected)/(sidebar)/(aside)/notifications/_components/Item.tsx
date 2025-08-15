"use client";

import type {
  NotificationInfo,
  CommunityNotification,
  UserCardDisplayInfo,
} from "api";
import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Shield, User } from "@/components/icons";

type NotificationItemProps = Readonly<{
  data: NotificationInfo;
  className?: string;
  onClick?: () => void;
}>;

export default function NotificationItem({
  data,
  className,
  onClick,
}: NotificationItemProps) {
  let content;
  switch (data.type) {
    case "security":
      content = <SecurityContent />;
      break;
    case "social":
      content = (
        <CommunityContent user={data.user} information={data.information} />
      );
      break;
  }

  return (
    <div
      className={cn("p-4 flex", "border-b border-border", className)}
      onClick={onClick}
    >
      {content}
    </div>
  );
}

function SecurityContent() {
  return (
    <>
      <div
        className={cn(
          "size-12 mr-3 shrink-0",
          "rounded-full bg-muted",
          "flex items-center justify-center"
        )}
      >
        <Shield variant="alert" className="size-7 text-muted-foreground" />
      </div>
      <div className="grow min-w-0">
        <span className="font-semibold">Security Alert</span>
        <p className="text-muted-foreground truncate">
          We noticed a new login from a device or location you don&apos;t
          usually use. Please review.
        </p>
      </div>
    </>
  );
}

type CommunityContentProps = {
  user: UserCardDisplayInfo;
  information: CommunityNotification["information"];
};

function CommunityContent({ user, information }: CommunityContentProps) {
  const titleContent =
    information.type === "follow" ? (
      <div>
        <span className="font-semibold inline-block">{user.displayName}</span>{" "}
        <p className="inline-block">requested to follow you</p>
      </div>
    ) : (
      <div className="font-semibold">{user.displayName}</div>
    );

  return (
    <>
      <div className="mr-3">
        <Avatar src={user.avatar} size="12" />
      </div>
      <div className="grow min-w-0">
        {titleContent}
        {information.type === "follow" ? (
          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" size="sm">
              <User variant="plus" className="size-4" />
              Accept
            </Button>
            <Button variant="outline" size="sm">
              <User variant="x" className="size-4" />
              Decline
            </Button>
          </div>
        ) : (
          <div className="text-muted-foreground truncate">
            <BoldContent content={information.content} />
          </div>
        )}
      </div>
    </>
  );
}

type BoldContentProps = {
  content: string;
};

function BoldContent({ content }: BoldContentProps) {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span className="font-semibold" key={index}>
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
