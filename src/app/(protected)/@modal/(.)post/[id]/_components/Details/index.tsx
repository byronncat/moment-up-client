import type { FeedItemDto } from "api";

import { useRef } from "react";
import { CommentProvider, useMoment } from "@/components/providers";
import { CommentZone, MomentHeader } from "@/components/post";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ButtonGroup from "./ButtonGroup";
import CommentInput from "./CommentInput";
import TextContent from "@/app/(protected)/(sidebar)/(aside)/post/[id]/_components/TextContent";
import { X } from "@/components/icons";

type ContentProps = Readonly<{
  data: FeedItemDto;
  haveMedia?: boolean;
  onClose?: () => void;
  className?: string;
}>;

export default function Content({
  data,
  haveMedia,
  onClose,
  className,
}: ContentProps) {
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const { like, bookmark, report, share, follow } = useMoment();

  function focusCommentInput() {
    commentInputRef.current?.focus();
  }

  return (
    <ScrollArea
      className={cn(
        "flex flex-col",
        "md:h-full bg-card",
        "md:border-l border-border",
        haveMedia
          ? "w-full md:w-[360px]"
          : "w-full max-w-[600px] max-h-[92vh] rounded-xl overflow-hidden border-r border-y",
        className
      )}
    >
      <MomentHeader
        data={data}
        actions={{
          follow,
          report,
        }}
        sideElement={
          !haveMedia && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full size-8",
                "text-muted-foreground",
                className
              )}
              onClick={onClose}
            >
              <X className="size-5" />
            </Button>
          )
        }
      />
      <TextContent data={data.post.text} />
      <ButtonGroup.SecondGroup
        postData={data.post}
        momentId={data.id}
        actions={{
          bookmark,
          share,
        }}
      />
      <ButtonGroup.FirstGroup
        momentId={data.id}
        postData={data.post}
        userData={data.user}
        actions={{
          like,
          bookmark,
          share,
        }}
        onCommentClick={focusCommentInput}
      />
      <CommentProvider momentId={data.id}>
        <CommentInput ref={commentInputRef} className="min-h-[68px]" />
        <CommentZone className="grow" />
      </CommentProvider>
    </ScrollArea>
  );
}
