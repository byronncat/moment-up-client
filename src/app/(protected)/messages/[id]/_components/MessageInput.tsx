"use client";

import { useState } from "react";
import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      className={cn("p-3", "flex items-center gap-2", "border-t border-border")}
    >
      <Button variant="ghost" className="rounded-full" size="icon">
        <Circle variant="plus" type="solid" className="size-5 fill-primary" />
      </Button>
      <div className="grow relative">
        <Input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Aa"
          className={cn(
            "border-0 focus-visible:ring-0",
            "bg-card rounded-full"
          )}
        />
        <Button
          variant="ghost"
          className={cn("rounded-full", "absolute right-0 top-0")}
          size="icon"
        >
          <FaceSmile className="size-5 fill-primary" />
        </Button>
      </div>
      <Button
        size="icon"
        onClick={handleSendMessage}
        disabled={!inputValue.trim()}
        variant="ghost"
        className="rounded-full"
      >
        <PaperPlane className="size-5 fill-primary" />
      </Button>
    </div>
  );
}
