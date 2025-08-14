import { useState } from "react";
import { useAuth, useComment } from "@/components/providers";
import { isEmpty } from "lodash";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaperPlane, Loader } from "@/components/icons";

type CommentInputProps = Readonly<{
  ref: React.RefObject<HTMLTextAreaElement | null>;
  className?: string;
}>;

export default function CommentInput({ ref, className }: CommentInputProps) {
  const { user } = useAuth();
  const { addComment } = useComment();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendComment() {
    if (!comment || !user) return;
    setIsLoading(true);
    const success = await addComment(comment);
    if (success) setComment("");
    setIsLoading(false);
  }

  return (
    <div className={cn("relative", className)}>
      <div className="size-full border border-transparent">
        <Textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          id="comment-input"
          placeholder="Add a comment..."
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className={cn(
            "rounded-none bg-transparent resize-none",
            "border-x-0 border-t-0 border-border",
            "pl-4 py-3 pr-12",
            "size-full min-h-[65px]"
          )}
        />

        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute top-2 right-3",
            "size-9 rounded-full",
            "flex items-center justify-center",
            "transition-opacity duration-150"
          )}
          onClick={handleSendComment}
          disabled={isEmpty(comment) || isLoading}
        >
          {isLoading ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            <PaperPlane
              className={cn(
                "size-5 translate-y-[1px] translate-x-[-1px]",
                isEmpty(comment) && "opacity-50"
              )}
            />
          )}
        </Button>
      </div>
    </div>
  );
}
