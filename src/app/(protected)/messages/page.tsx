"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useContact } from "./_provider/Contact";
import { cn } from "@/libraries/utils";

import { Button } from "@/components/ui/button";
import { ROUTE } from "@/constants/route";

export default function Messages() {
  const { currentContactId } = useContact();
  const router = useRouter();

  useEffect(() => {
    if (currentContactId) router.push(ROUTE.MESSAGE(currentContactId));
  }, [currentContactId, router]);

  if (currentContactId) return null;

  return (
    <div className={cn("flex flex-col", "h-full")}>
      <div
        className={cn("flex flex-col items-center justify-center", "grow p-4")}
      >
        <h2 className={cn("text-lg font-medium", "mb-2")}>Your messages</h2>
        <p className={cn("text-sm text-muted-foreground", "mb-4")}>
          Send a message to start a chat.
        </p>
        <Button>Send message</Button>
      </div>
    </div>
  );
}
