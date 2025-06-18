import type { DetailedMomentInfo, CommentInfo } from "api";
import type { Actions } from "@/components/providers/MomentData";

import { Suspense, useMemo, useRef, useState } from "react";
import { CoreApi } from "@/services";
import { SortBy } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/moment/moment-card/Header";
import TextContent from "./TextContent";
import ButtonGroup from "./ButtonGroup";
import { CommentZone, CommentInput, CommentSkeletons } from "./comment";
import { X } from "lucide-react";

type ContentProps = Readonly<{
  className?: string;
  onClose?: () => void;
  actions: Actions;
  data: DetailedMomentInfo;
}>;

export default function Content({
  className,
  onClose,
  actions,
  data,
}: ContentProps) {
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const commentResponse = useMemo(
    () => CoreApi.getComments(data.id, 1, SortBy.MOST_LIKED),
    [data.id]
  );
  const [comments, setComments] = useState<CommentInfo[]>([]);

  function focusCommentInput() {
    commentInputRef.current?.focus();
  }

  function handleAddComment(comment: CommentInfo) {
    setComments([comment, ...comments]);
  }

  return (
    <div className={cn("flex flex-col", "h-full bg-card", className)}>
      <div className="relative">
        <Header data={data} actions={actions} />
        {onClose && (
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full size-8", className)}
              onClick={onClose}
            >
              <X className="size-5" />
            </Button>
          </div>
        )}
      </div>
      {/* 72px: header height, 120px: comment input height, 44px: button group height, 1px: border */}
      <ScrollArea className="h-[calc(100%-72px-120px-44px-1px)]">
        <div className="flex flex-col grow">
          <TextContent data={data.post.text} />
          <ButtonGroup.FirstGroup
            momentId={data.id}
            postData={data.post}
            userData={data.user}
            actions={actions}
            onCommentClick={focusCommentInput}
          />
          <Suspense fallback={<CommentSkeletons />}>
            <CommentZone
              className="grow"
              data={commentResponse}
              comments={comments}
              setComments={setComments}
            />
          </Suspense>
        </div>
      </ScrollArea>
      <ButtonGroup.SecondGroup
        postData={data.post}
        momentId={data.id}
        actions={actions}
        className="border-t border-border"
      />
      <CommentInput ref={commentInputRef} onComment={handleAddComment} />
    </div>
  );
}
