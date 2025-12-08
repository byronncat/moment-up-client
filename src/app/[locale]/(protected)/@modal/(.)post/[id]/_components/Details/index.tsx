import type { FeedItemDto } from "api";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { cn } from "@/libraries/utils";
import { CommentProvider, usePost } from "@/components/providers";
import { CommentZone, PostHeader } from "@/components/post";
import { ScrollArea } from "@/components/ui/scroll-area";
import ButtonGroup from "./ButtonGroup";
import TextContent from "@/app/[locale]/(protected)/(sidebar)/(aside)/post/[id]/_components/TextContent";
import CommentInput from "./CommentInput";

type ContentProps = Readonly<{
  data: FeedItemDto;
  haveMedia?: boolean;
  className?: string;
}>;

export default function Content({ data, haveMedia, className }: ContentProps) {
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { deletePost, like, bookmark, report, share, follow } = usePost();

  function focusCommentInput() {
    commentInputRef.current?.focus();
  }

  function handleDelete() {
    deletePost(data.id);
    router.back();
  }

  const content = (
    <>
      <PostHeader
        disablePortal
        data={data}
        actions={{
          delete: handleDelete,
          follow,
          report,
        }}
        className={cn(!haveMedia && "max-w-screen sm:w-[600px]")}
      />
      <TextContent data={data.post.text} />
      <ButtonGroup.SecondGroup
        postData={data.post}
        momentId={data.id}
        actions={{
          bookmark,
          share,
        }}
        className="pt-1 pb-3 pr-2"
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
        className="py-1 text-muted-foreground"
      />
      <CommentProvider postId={data.id}>
        <CommentInput ref={commentInputRef} className="min-h-[68px]" />
        <CommentZone className="grow" />
      </CommentProvider>
    </>
  );

  return (
    <div className={cn("bg-background min-w-0", className)}>
      {haveMedia ? (
        content
      ) : (
        <ScrollArea className="h-full">{content}</ScrollArea>
      )}
    </div>
  );
}
