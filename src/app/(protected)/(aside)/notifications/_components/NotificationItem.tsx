"use client";

import type { Notification } from "api";
import { cn } from "@/libraries/utils";
import { Avatar } from "@/components";
import { Button } from "@/components/ui/button";
import { ShieldAlert, UserPlus, UserX } from "lucide-react";

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

type SecurityNotificationProps = {
  information: "login";
};

const SecurityNotification = ({ information }: SecurityNotificationProps) => {
  const title = "Security Alert";
  const description =
    information === "login"
      ? "We noticed a new login from a device or location you don't usually use. Please review."
      : "";

  return (
    <>
      <div className="mr-3">
        <div
          className={cn(
            "size-12 rounded-full bg-muted",
            "flex items-center justify-center"
          )}
        >
          <ShieldAlert className="size-7" />
        </div>
      </div>
      <div className="grow min-w-0">
        <div className="font-bold">{title}</div>
        <div className="text-muted-foreground truncate">{description}</div>
      </div>
    </>
  );
};

type CommunityInformation = {
  type: "follow" | "post" | "mention";
  displayName: string;
  avatar?: string;
} & ({ type: "follow" } | { type: "post" | "mention"; content: string });

type CommunityNotificationProps = {
  information: CommunityInformation;
};

const CommunityNotification = ({ information }: CommunityNotificationProps) => {
  const title =
    information.type === "follow"
      ? `${information.displayName} requested to follow you`
      : information.displayName;

  return (
    <>
      <div className="mr-3">
        <Avatar src={information.avatar} size="12" />
      </div>
      <div className="grow min-w-0">
        <div className="font-bold">{title}</div>
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

export default function NotificationItem({
  data,
}: Readonly<{
  data: Notification;
}>) {
  return (
    <div className={cn("p-4", "border-b border-border", "flex")}>
      {data.type === "security" && (
        <SecurityNotification information={data.information} />
      )}
      {data.type === "community" && (
        <CommunityNotification information={data.information} />
      )}
    </div>
  );
}
