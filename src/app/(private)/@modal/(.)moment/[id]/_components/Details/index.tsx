import type { MomentInfo } from "api";

import { useRef } from "react";
import { useMoment } from "@/components/providers";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MomentHeader,
  CommentZone,
  CommentDataProvider,
} from "@/components/moment";
import ButtonGroup from "./ButtonGroup";
import CommentInput from "./CommentInput";
import TextContent from "@/app/(private)/(sidebar)/(aside)/moment/[id]/_components/TextContent";
import { X } from "@/components/icons";

type ContentProps = Readonly<{
  data: MomentInfo;
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
  const { like, bookmark, report, share, follow, block } = useMoment();

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
      <div className="relative">
        <MomentHeader
          data={data}
          truncateClassName="truncate max-w-[120px]"
          actions={{
            follow,
            block: async (momentId) => {
              onClose?.();
              await block(momentId, { remove: true });
            },
            report,
          }}
          sideButton={
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
      </div>
      <div className="flex flex-col">
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
        <CommentDataProvider momentId={data.id}>
          <CommentInput ref={commentInputRef} className="min-h-[68px]" />
          <CommentZone className="grow" />
        </CommentDataProvider>
      </div>
    </ScrollArea>
  );
}
