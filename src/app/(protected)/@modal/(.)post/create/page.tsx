"use client";

import type { PhaseData, PhaseState } from "./types";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PostDataProvider, { usePostData } from "./_provider/PostData";

import { cn } from "@/libraries/utils";
import { Modal } from "@/components/common";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  DiscardDialog,
  Header,
  Preview,
  TextContent,
  UploadMediaWindow,
} from "./_components";
import { Image as ImageIcon } from "@/components/icons";
import { SquarePen } from "lucide-react";

export default function ProviderWrapper() {
  return (
    <PostDataProvider>
      <CreatePostPage />
    </PostDataProvider>
  );
}

function CreatePostPage() {
  const router = useRouter();
  const { isUploading, hasContent, phase, setPhase } = usePostData();
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);

  function handleClose() {
    if (isUploading) return;
    if (hasContent) {
      setIsDiscardDialogOpen(true);
    } else router.back();
  }

  const phaseData: Record<PhaseState, PhaseData> = {
    text: {
      title: "Write your post",
      component: <TextContent />,
    },
    media: {
      title: "Upload media",
      component: <UploadMediaWindow />,
      buttons: [
        {
          id: "edit",
          icon: <SquarePen className="size-4" />,
          onClick: () => setPhase("text"),
        },
      ],
    },
    preview: {
      title: "Preview",
      component: <Preview />,
      buttons: [
        {
          id: "edit",
          icon: <SquarePen className="size-4" />,
          onClick: () => setPhase("text"),
        },
        {
          id: "add-media",
          icon: <ImageIcon className="size-4" />,
          onClick: () => setPhase("media"),
        },
      ],
    },
  };

  return (
    <Modal onClose={handleClose} className={cn("items-start sm:items-center")}>
      <div
        className={cn(
          "flex flex-col",
          "bg-background sm:rounded-lg overflow-hidden",
          isDiscardDialogOpen && "hidden"
        )}
      >
        <Header
          data={phaseData[phase]}
          onClose={handleClose}
          className="shrink-0"
        />

        {phaseData[phase].component}
      </div>

      <AlertDialog open={isDiscardDialogOpen}>
        <DiscardDialog
          onCancel={() => {
            setIsDiscardDialogOpen(false);
          }}
          onClose={() => {
            router.back();
          }}
        />
      </AlertDialog>
    </Modal>
  );
}
