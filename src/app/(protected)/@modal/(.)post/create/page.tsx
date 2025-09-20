"use client";

import type { PhaseData, PhaseState } from "./types";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PostDataProvider, { usePostData } from "./_provider/PostData";

import { cn } from "@/libraries/utils";
import { FocusTrapProvider, Modal, useFocusTrap } from "@/components/common";
import { Button } from "@/components/ui/button";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  DiscardDialog,
  Header,
  Preview,
  TextContent,
  UploadMediaWindow,
} from "./_components";
import { Image as ImageIcon, X } from "@/components/icons";
import { SquarePen } from "lucide-react";

export default function ProviderWrapper() {
  return (
    <FocusTrapProvider defaultEnabled>
      <PostDataProvider>
        <CreatePostPage />
      </PostDataProvider>
    </FocusTrapProvider>
  );
}

function CreatePostPage() {
  const router = useRouter();
  const { isUploading, hasContent, phase, setPhase } = usePostData();
  const { setFocusTrapEnabled } = useFocusTrap();
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);

  function handleClose() {
    if (isUploading) return;
    if (hasContent) {
      setFocusTrapEnabled(false);
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
    <Modal onClose={handleClose} className="flex items-center justify-center">
      <div
        className={cn(
          "flex flex-col",
          "bg-background sm:rounded-lg overflow-hidden",
          "h-full sm:h-auto",
          phase === "media" ? "w-fit" : "w-full sm:max-w-lg"
        )}
      >
        <AlertDialog
          open={isDiscardDialogOpen}
          onOpenChange={(open) => {
            setFocusTrapEnabled(!open);
            setIsDiscardDialogOpen(open);
          }}
        >
          <Header
            data={phaseData[phase]}
            onClose={handleClose}
            className="shrink-0"
          />

          {phaseData[phase].component}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className={cn(
              "hidden sm:flex",
              "rounded-full",
              "absolute right-2 top-2",
              "text-muted-foreground-dark",
              "hover:bg-accent-dark/[.1] hover:text-accent-foreground-dark",
              "focus-indicator-dark"
            )}
          >
            <X className="size-5" />
          </Button>

          <DiscardDialog
            onClose={() => {
              setIsDiscardDialogOpen(false);
              router.back();
            }}
          />
        </AlertDialog>
      </div>
    </Modal>
  );
}
