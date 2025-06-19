import type { CommentInfo } from "api";

import { useState } from "react";
import { useAuth } from "@/components/providers";
import { isEmpty } from "lodash";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

type CommentInputProps = Readonly<{
  ref: React.RefObject<HTMLTextAreaElement | null>;
  onComment: (comment: CommentInfo) => Promise<boolean>;
  className?: string;
}>;

export default function CommentInput({
  ref,
  onComment,
  className,
}: CommentInputProps) {
  const [comment, setComment] = useState("");
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendComment() {
    if (!comment || !user) return;
    setIsLoading(true);
    const success = await onComment({
      id: crypto.randomUUID(),
      content: comment,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      user,
    });
    if (success) setComment("");
    setIsLoading(false);
  }

  return (
    <div className={cn("h-[120px] relative", className)}>
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
          "size-9 rounded-full",
          "flex items-center justify-center",
          "transition-opacity duration-150"
        )}
        onClick={handleSendComment}
        disabled={isEmpty(comment) || isLoading}
      >
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Send
            className={cn(
              "size-5 translate-y-[1px] translate-x-[-1px]",
              isEmpty(comment) && "opacity-50"
            )}
          />
        )}
      </Button>
    </div>
  );
}
