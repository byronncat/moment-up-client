"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePost } from "@/components/providers";

import { cn } from "@/libraries/utils";
import { Modal } from "@/components/common";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { DiscardDialog, Header } from "../../create/_components";
import TextContent from "./_components/TextContent";

import { ContentPrivacy } from "@/constants/server";

export default function CreatePostPage() {
  const router = useRouter();
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);

  const { getCurrentPost } = usePost();
  const currentPost = getCurrentPost();
  const hasAttachments = !!(
    currentPost?.post.files && currentPost.post.files.length > 0
  );

  const [text, setText] = useState(currentPost?.post.text ?? "");
  const [privacy, setPrivacy] = useState(
    currentPost?.post.privacy ?? ContentPrivacy.PUBLIC
  );

  function handleClose() {
    router.back();
  }

  function handleDiscard() {
    if (text === currentPost?.post.text) {
      router.back();
      return;
    }
    setIsDiscardDialogOpen(true);
  }

  if (!currentPost) return null;
  return (
    <Modal
      onClose={handleDiscard}
      className={cn("items-start sm:items-center")}
    >
      <div
        className={cn(
          "flex flex-col",
          "bg-background sm:rounded-lg overflow-hidden",
          "w-full sm:w-fit",
          isDiscardDialogOpen && "hidden"
        )}
      >
        <Header
          title="Update post"
          onClose={handleDiscard}
          className="shrink-0"
        />

        <TextContent
          postId={currentPost.id}
          text={text}
          privacy={privacy}
          hasAttachments={hasAttachments}
          setText={setText}
          setPrivacy={setPrivacy}
          onClose={handleClose}
        />
      </div>

      <AlertDialog open={isDiscardDialogOpen}>
        <DiscardDialog
          onClose={handleClose}
          onCancel={() => {
            setIsDiscardDialogOpen(false);
          }}
        />
      </AlertDialog>
    </Modal>
  );
}
