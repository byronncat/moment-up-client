"use client";

import type { MessageDto } from "api";
import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";

export default function ChatMessage({
  message,
}: Readonly<{ message: MessageDto }>) {
  const isMe = message.user.id === "1";

  return (
    <div className={cn("flex", isMe ? "justify-end" : "justify-start")}>
      {!isMe && (
        <Avatar
          src={message.user.avatar}
          alt={message.user.name}
          size="10"
          className="mr-2"
        />
      )}
      <div
        className={cn(
          "flex flex-col gap-0.5",
          "max-w-[70%]",
          isMe ? "items-end" : "items-start"
        )}
      >
        <div className="flex items-center">
          <div
            className={cn(
              "px-3 py-2 rounded-2xl",
              isMe ? "bg-blue-500 text-white" : "bg-muted"
            )}
          >
            <p className="text-sm">{message.text}</p>
          </div>
        </div>

        <div
          className={cn(
            "text-xs text-muted-foreground",
            isMe ? "mr-2" : "ml-2"
          )}
        >
          {message.timestamp}
        </div>
      </div>
    </div>
  );
}
