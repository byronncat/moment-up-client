"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { usePost } from "@/components/providers/PostStorage";

import { cn } from "@/libraries/utils";
import { Modal } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Details, MediaCarousel } from "./_components";
import { X } from "@/components/icons";

export default function MomentModal() {
  const searchParams = useSearchParams();
  const { getCurrentPost } = usePost();

  const imgIndex = searchParams.get("imgIndex");
  const initialIndex = imgIndex ? parseInt(imgIndex) : 0;
  const post = getCurrentPost();
  const haveMedia = (post?.post.files && post.post.files.length > 0) ?? false;

  const router = useRouter();
  function handleClose() {
    router.back();
  }

  if (!post) return null;
  return (
    <Modal
      onClose={haveMedia ? undefined : handleClose}
      className={cn(!haveMedia && "flex justify-center items-center")}
    >
      <div
        className={cn(
          "relative",
          "flex flex-col",
          haveMedia
            ? "h-full overflow-y-auto md:flex-row w-full"
            : "size-full sm:w-fit sm:h-[80vh] sm:rounded-lg overflow-hidden sm:border border-border"
        )}
      >
        <div
          className={cn(
            "relative",
            "h-12 bg-card font-semibold",
            "border-b border-border",
            "flex items-center justify-center",
            haveMedia && "md:hidden shrink-0 sticky top-0 z-10"
          )}
        >
          <h2>{post.user.displayName ?? post.user.username}&apos;s post</h2>
          <CloseButton
            onClose={handleClose}
            className={cn("absolute right-3 top-1.5")}
          />
        </div>
        {haveMedia ? (
          <MediaCarousel
            files={post.post.files}
            initialIndex={initialIndex}
            className="w-full"
          />
        ) : null}
        <Details
          data={post}
          haveMedia={haveMedia}
          className={cn(
            "shrink-0",
            "w-full min-h-[50vh]",
            haveMedia
              ? "md:h-screen md:w-[360px] md:overflow-y-auto dark:border-t dark:sm:border-t-0 dark:sm:border-l dark:border-border"
              : "sm:max-w-[600px] h-[calc(100%-48px)] sm:h-[calc(80dvh-48px-2*1px)]"
          )}
        />
        <CloseButton
          onClose={handleClose}
          className={cn(
            "rounded-full absolute",
            haveMedia ? "right-2 md:left-2 top-2" : "top-1.5 right-3"
          )}
        />
      </div>
    </Modal>
  );
}

function CloseButton({
  onClose,
  className,
}: Readonly<{ onClose: () => void; className: string }>) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-full", className)}
      onClick={onClose}
    >
      <X className="size-5 text-muted-foreground" />
    </Button>
  );
}
