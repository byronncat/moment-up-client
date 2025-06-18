import type { CommentInfo } from "api";

import { useState } from "react";
import { useAuth } from "@/components/providers";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

type CommentInputProps = Readonly<{
  ref: React.RefObject<HTMLTextAreaElement | null>;
  onComment: (comment: CommentInfo) => void;
}>;

export default function CommentInput({ ref, onComment }: CommentInputProps) {
  const [comment, setComment] = useState("");
  const { user } = useAuth();

  function handleSendComment() {
    if (!comment || !user) return;
    onComment({
      id: crypto.randomUUID(),
      content: comment,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      user,
    });
    setComment("");
  }

  return (
    <div className="h-[120px] relative">
      <Textarea
        ref={ref}
        id="comment-input"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className={cn(
          "rounded-none border-none resize-none",
          "px-4 py-2 pr-12 bg-input/30",
          "h-[120px]"
        )}
      />
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "absolute top-2 right-2",
          "size-10 rounded-full",
          "flex items-center justify-center"
        )}
        onClick={handleSendComment}
      >
        <Send className="size-5 translate-y-[1px] translate-x-[-1px]" />
      </Button>
    </div>
  );
}
