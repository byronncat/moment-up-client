"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useContact } from "./_provider/Contact";
import { cn } from "@/libraries/utils";

import { Button } from "@/components/ui/button";
import { ROUTE } from "@/constants/route";
import { Message } from "@/components/icons";

export default function Messages() {
  const { currentContactId } = useContact();
  const router = useRouter();

  useEffect(() => {
    if (currentContactId) router.replace(ROUTE.MESSAGE(currentContactId));
  }, [currentContactId, router]);

  if (currentContactId) return null;
  return (
    <div
      className={cn("flex flex-col items-center justify-center", "p-4 h-full")}
    >
      <Message variant="square" text className="size-10 mb-3" />
      <h2 className={cn("text-lg font-medium", "mb-1")}>No messages yet</h2>
      <p className={cn("text-sm text-muted-foreground", "mb-4")}>
        Send a message to start a chat.
      </p>
      <Button variant="outline">Send message</Button>
    </div>
  );
}
