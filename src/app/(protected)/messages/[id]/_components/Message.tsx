"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Message } from "@/__mocks__";
import { User } from "@/components/icons";
type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex",
        message.user.id === "2" ? "justify-end" : "justify-start"
      )}
    >
      {message.user.id !== "2" && (
        <Avatar className="size-10 mr-2">
          <AvatarImage
            src={message.user.avatar}
            alt={message.user.name}
            className="object-cover object-top"
          />
          <AvatarFallback className="bg-primary">
            <User className="size-6 fill-card" type="solid" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col gap-0.5",
          "max-w-[70%]",
          message.user.id === "2" ? "items-end" : "items-start"
        )}
      >
        <div className="h-10 flex items-center">
          <div
            className={cn(
              "px-3 py-2 rounded-2xl",
              message.user.id === "2" ? "bg-blue-500 text-white" : "bg-muted"
            )}
          >
            <p className="text-sm">{message.text}</p>
          </div>
        </div>
        <div
          className={cn(
            "text-xs text-muted-foreground",
            message.user.id === "2" ? "mr-2" : "ml-2"
          )}
        >
          {message.timestamp}
        </div>
      </div>
    </div>
  );
}
