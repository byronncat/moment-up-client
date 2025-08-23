"use client";

import type { PhaseData, PhaseState } from "./types";

import { useRouter } from "next/navigation";
import { useState } from "react";
import MomentDataProvider, { useMomentData } from "./_provider/MomentData";

import { cn } from "@/libraries/utils";
import { Modal } from "@/components/common";
import { Button } from "@/components/ui/button";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  TextContent,
  UploadMediaWindow,
  Preview,
  Header,
  DiscardDialog,
} from "./_components";
import { Image as ImageIcon, X } from "@/components/icons";
import { SquarePen } from "lucide-react";

export default function ProviderWrapper() {
  return (
    <MomentDataProvider>
      <CreateMomentPage />
    </MomentDataProvider>
  );
}

function CreateMomentPage() {
  const router = useRouter();
  const { hasContent, phase, setPhase } = useMomentData();
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);

  function handleClose() {
    if (hasContent) setIsDiscardDialogOpen(true);
    else router.back();
  }

  const phaseData: Record<PhaseState, PhaseData> = {
    text: {
      title: "Write your moment",
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
        className={cn("flex flex-col", "bg-card rounded-2xl overflow-hidden")}
      >
        <AlertDialog
          open={isDiscardDialogOpen}
          onOpenChange={setIsDiscardDialogOpen}
        >
          <Header data={phaseData[phase]} handleClose={handleClose} />

          {phaseData[phase].component}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className={cn(
              "rounded-full",
              "absolute right-2 top-2",
              "text-muted-foreground-dark",
              "hover:bg-accent-dark/[.1] hover:text-accent-foreground-dark"
            )}
          >
            <X />
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
