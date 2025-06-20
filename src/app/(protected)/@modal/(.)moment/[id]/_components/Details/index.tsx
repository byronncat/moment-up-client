import type { DetailedMomentInfo } from "api";

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
import TextContent from "@/app/(protected)/(aside)/moment/[id]/_components/TextContent";
import { X } from "lucide-react";

type ContentProps = Readonly<{
  data: DetailedMomentInfo;
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
    <div
      className={cn(
        "flex flex-col",
        "md:h-full bg-card",
        "md:border-l border-border",
        haveMedia
          ? "w-full md:w-[360px]"
          : "w-full max-w-[600px] max-h-[92vh] rounded-xl overflow-hidden border-r border-y",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <MomentHeader
          data={data}
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
      <CommentDataProvider momentId={data.id}>
        {/* 72px: header height, 120px: comment input height, 44px: button group height, 1px: border */}
        <ScrollArea className="md:h-[calc(100%-76px-120px-44px-1px)]">
          <div className="flex flex-col">
            <TextContent data={data.post.text} />
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
            <CommentZone className="grow" />
          </div>
        </ScrollArea>
        <div className="sticky bottom-0 md:static bg-card">
          <ButtonGroup.SecondGroup
            postData={data.post}
            momentId={data.id}
            actions={{
              bookmark,
              share,
            }}
            className="border-t border-border"
          />
          <CommentInput
            ref={commentInputRef}
            className="h-[120px]"
            haveMedia={haveMedia}
          />
        </div>
      </CommentDataProvider>
    </div>
  );
}
