"use client";

import type {
  NotificationInfo,
  CommunityNotification,
  UserCardDisplayInfo,
} from "api";
import { cn } from "@/libraries/utils";
import { Avatar } from "@/components";
import { Button } from "@/components/ui/button";
import { ShieldAlert, UserPlus, UserX } from "lucide-react";

function SecurityNotification() {
  const title = "Security Alert";
  const description =
    "We noticed a new login from a device or location you don't usually use. Please review.";

  return (
    <>
      <div className="mr-3">
        <div
          className={cn(
            "size-12 rounded-full bg-muted",
            "flex items-center justify-center"
          )}
        >
          <ShieldAlert className="size-7 text-muted-foreground" />
        </div>
      </div>
      <div className="grow min-w-0">
        <div className="font-semibold">{title}</div>
        <div className="text-muted-foreground truncate">{description}</div>
      </div>
    </>
  );
}

type CommunityNotificationProps = {
  user: UserCardDisplayInfo;
  information: CommunityNotification["information"];
};

const CommunityNotification = ({
  user,
  information,
}: CommunityNotificationProps) => {
  const title =
    information.type === "follow"
      ? `${user.displayName} requested to follow you`
      : user.displayName;

  return (
    <>
      <div className="mr-3">
        <Avatar src={user.avatar} size="12" />
      </div>
      <div className="grow min-w-0">
        <div className="font-semibold">{title}</div>
        {information.type === "follow" ? (
          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" size="sm">
              <UserPlus className="size-4" />
              Accept
            </Button>
            <Button variant="outline" size="sm">
              <UserX className="size-4" />
              Decline
            </Button>
          </div>
        ) : (
          <div className="text-muted-foreground truncate">
            <FormattedContent content={information.content} />
          </div>
        )}
      </div>
    </>
  );
};

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
  return (
    <div
      className={cn("p-4 flex", "border-b border-border", className)}
      onClick={onClick}
    >
      {data.type === "security" && <SecurityNotification />}
      {data.type === "social" && (
        <CommunityNotification
          user={data.user}
          information={data.information}
        />
      )}
    </div>
  );
}

type FormattedContentProps = {
  content: string;
};

function FormattedContent({ content }: FormattedContentProps) {
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
