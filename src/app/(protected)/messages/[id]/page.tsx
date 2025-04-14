"use client";

import {
  type Message,
  mockContacts,
  mockInitialMessages,
  getRandomAvatar,
} from "@/__mocks__";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Header, Message as ChatMessage, MessageInput } from "./_components";
import { useParams } from "next/navigation";
export default function Message() {
  const contactId = useParams().id;
  const [messages, setMessages] = useState<Message[]>(mockInitialMessages);
  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      user: {
        id: "1",
        name: "La Vie",
        avatar: getRandomAvatar(),
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
          Mar 23, 2025, 1:18 AM
        </div>

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
