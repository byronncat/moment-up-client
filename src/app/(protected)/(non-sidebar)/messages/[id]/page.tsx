"use client";

import { getRandomFile, mockContacts, mockInitialMessages } from "@/__mocks__";
import type { MessageDto } from "api";

import { useState } from "react";
import { cn } from "@/libraries/utils";
import { Message as ChatMessage, Header, MessageInput } from "./_components";
import { useParams } from "next/navigation";
export default function Message() {
  const contactId = useParams().id;
  const [messages, setMessages] = useState<MessageDto[]>(mockInitialMessages);
  const handleSendMessage = (text: string) => {
    const newMessage: MessageDto = {
      id: Date.now().toString(),
      text,
      user: {
        id: "1",
        name: "cberling0",
        avatar: getRandomFile("cberling0"),
      },
      timestamp: "Just now",
    };
    setMessages([...messages, newMessage]);
  };

  const contact = mockContacts.find((contact) => contact.id === contactId);

  return (
    <div className="flex flex-col h-full">
      <Header contact={contact} />

      <div className={cn("grow overflow-y-auto", "p-4 space-y-4")}>
        <div
          className={cn(
            "text-center text-xs text-muted-foreground font-semibold",
            "mb-4"
          )}
        >
          Mar 23, 2025, 1:18 AM
        </div>

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
