"use client";

import { useState } from "react";
import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Circle, FaceSmile, PaperPlane } from "@/components/icons";

type MessageInputProps = {
  onSendMessage: (message: string) => void;
};

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        "border-t border-border",
        "px-4 py-3"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          "px-2 py-1 bg-input w-full rounded-full"
        )}
      >
        <Button variant="ghost" className="rounded-full" size="icon">
          <Circle variant="plus" className="size-4 fill-muted-foreground" />
        </Button>

        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Aa"
          className={cn("bg-transparent", "block py-2 grow", "outline-none")}
        />

        <Button
          size="icon"
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          variant="ghost"
          className="rounded-full"
        >
          <PaperPlane className="size-4 fill-foreground" />
        </Button>
      </div>
    </div>
  );
}
