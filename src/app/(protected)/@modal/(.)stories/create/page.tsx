"use client";

import { useRouter } from "next/navigation";
import { ROUTE } from "@/constants/route";

import { Modal } from "@/components/common";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  ContentSection,
  RightNav,
  DiscardDialog,
  CloseButton,
} from "./_components";

import { CreateDataProvider, CanvasProvider, useCreateData } from "./_provider";

function StoryModalContent() {
  const router = useRouter();
  const { hasContent } = useCreateData();

  function handleClose() {
    if (window.history.length > 1) router.back();
    else router.replace(ROUTE.HOME);
  }

  return (
    <Modal className="flex">
      <AlertDialog>
        <ContentSection />
        <RightNav />
        <CloseButton
          onClose={handleClose}
          haveContent={hasContent}
          className="absolute top-2 left-2"
        />
        <DiscardDialog onClose={handleClose} />
      </AlertDialog>
    </Modal>
  );
}

export default function StoryModal() {
  return (
    <CreateDataProvider>
      <CanvasProvider>
        <StoryModalContent />
      </CanvasProvider>
    </CreateDataProvider>
  );
}
