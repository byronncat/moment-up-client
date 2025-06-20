import { useState } from "react";
import { useAuth } from "@/components/providers";
import { useComment } from "@/components/moment/comment";
import { isEmpty } from "lodash";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

type CommentInputProps = Readonly<{
  ref: React.RefObject<HTMLTextAreaElement | null>;
  className?: string;
  haveMedia?: boolean;
}>;

export default function CommentInput({
  ref,
  className,
  haveMedia,
}: CommentInputProps) {
  const { user } = useAuth();
  const { handleComment } = useComment();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendComment() {
    if (!comment || !user) return;
    setIsLoading(true);
    const success = await handleComment({
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
    <div className={cn("relative", className)}>
      <div className="bg-input/70 size-full">
        <div className="size-full border border-transparent">
          <Textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            id="comment-input"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={cn(
              "border-none",
              "pl-4 py-2 pr-12 size-full",
              "scrollbar-hide resize-none",
              "bg-transparent",
              haveMedia ? "rounded-none" : "rounded-t-none rounded-b-xl"
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
      </div>
    </div>
  );
}
