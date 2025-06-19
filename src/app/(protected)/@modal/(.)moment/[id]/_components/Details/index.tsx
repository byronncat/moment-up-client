import type { DetailedMomentInfo, CommentInfo } from "api";
import type { Actions } from "@/components/providers/MomentData";

import { Suspense, useMemo, useRef, useState } from "react";
import { CoreApi } from "@/services";
import { toast } from "sonner";
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
  data: DetailedMomentInfo;
  haveMedia?: boolean;
  onClose?: () => void;
  actions: Actions;
  className?: string;
}>;

export default function Content({
  data,
  haveMedia,
  onClose,
  actions,
  className,
}: ContentProps) {
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const commentResponse = useMemo(
    () => CoreApi.getComments(data.id, 0, SortBy.MOST_LIKED),
    [data.id]
  );
  const page = useRef(1);
  const [comments, setComments] = useState<CommentInfo[]>();
  const [hasNextPage, setHasNextPage] = useState(true);

  function refetchComments() {
    async function fetch() {
      const res = await CoreApi.getComments(data.id, 0, SortBy.MOST_LIKED);
      if (!res.success) throw new Error(res.message);
      setComments(res.data?.items || []);
      setHasNextPage(res.data?.hasNextPage || false);
    }

    toast.promise(fetch(), {
      loading: "Loading comments...",
      error: "Failed to load comments",
    });
  }

  async function fetchMore() {
    const res = await CoreApi.getComments(
      data.id,
      page.current,
      SortBy.MOST_LIKED
    );
    if (res.success) {
      setComments((prev) => [...(prev || []), ...(res.data?.items || [])]);
      setHasNextPage(res.data?.hasNextPage || false);
      page.current++;
    } else toast.error("Failed to load comments");
  }

  function focusCommentInput() {
    commentInputRef.current?.focus();
  }

  async function handleComment(comment: CommentInfo) {
    const res = await CoreApi.comment(data.id, comment);
    if (res.success) setComments((prev) => [comment, ...(prev || [])]);
    else toast.error("Something went wrong!");
    return res.success;
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
        <Header
          data={data}
          actions={actions}
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
      {/* 72px: header height, 120px: comment input height, 44px: button group height, 1px: border */}
      <ScrollArea className="md:h-[calc(100%-76px-120px-44px-1px)]">
        <div className="flex flex-col">
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
              hasNextPage={hasNextPage}
              setComments={setComments}
              onRefresh={refetchComments}
              onFetchMore={fetchMore}
            />
          </Suspense>
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 md:static bg-card">
        <ButtonGroup.SecondGroup
          postData={data.post}
          momentId={data.id}
          actions={actions}
          className="border-t border-border"
        />
        <CommentInput ref={commentInputRef} onComment={handleComment} />
      </div>
    </div>
  );
}
