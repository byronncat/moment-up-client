"use client";

import { useRouter } from "next/navigation";
import {
  CanvasProvider,
  CreateDataProvider,
  useCreateData,
} from "./_providers";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import { Modal } from "@/components/common";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  CloseButton,
  ContentSection,
  DiscardDialog,
  RightNav,
} from "./_components";

function CreateStoryModal() {
  const router = useRouter();
  const { hasContent, type } = useCreateData();

  function handleClose() {
    if (window.history.length > 1) router.back();
    else router.replace(ROUTE.HOME);
  }

  return (
    <Modal>
      <AlertDialog>
        <div
          className={cn(
            "flex flex-col md:flex-row overflow-y-auto",
            "size-full"
          )}
        >
          <CloseButton
            onClose={handleClose}
            haveContent={hasContent}
            className={cn(
              "absolute top-2 left-2",
              type !== null && "hidden md:flex"
            )}
          />

          <ContentSection
            className={cn(
              "w-full h-svh md:w-auto md:h-full",
              "shrink-0 sm:grow"
            )}
          />

          <RightNav
            className={cn("md:w-[360px]", type === null && "hidden lg:block")}
          />

          <DiscardDialog disablePortal onClose={handleClose} />
        </div>
      </AlertDialog>
    </Modal>
  );
}

export default function Container() {
  return (
    <CreateDataProvider>
      <CanvasProvider>
        <CreateStoryModal />
      </CanvasProvider>
    </CreateDataProvider>
  );
}
