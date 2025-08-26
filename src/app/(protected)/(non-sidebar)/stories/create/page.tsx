"use client";

import { useRouter } from "next/navigation";
import {
  CreateDataProvider,
  CanvasProvider,
  useCreateData,
} from "@/app/(protected)/@modal/(.)stories/create/_providers";
import { ROUTE } from "@/constants/route";

import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  ContentSection,
  RightNav,
  DiscardDialog,
  CloseButton,
} from "@/app/(protected)/@modal/(.)stories/create/_components";

function CreateStoryPage() {
  const router = useRouter();
  const { hasContent } = useCreateData();

  function handleClose() {
    router.replace(ROUTE.HOME);
  }

  return (
    <div className="size-full flex">
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
    </div>
  );
}

export default function StoryModal() {
  return (
    <CreateDataProvider>
      <CanvasProvider>
        <CreateStoryPage />
      </CanvasProvider>
    </CreateDataProvider>
  );
}
