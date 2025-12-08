"use client";

import { useRouter } from "next/navigation";
import {
  CanvasProvider,
  CreateDataProvider,
  useCreateData,
} from "@/app/[locale]/(protected)/@modal/(.)stories/create/_providers";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  CloseButton,
  ContentSection,
  DiscardDialog,
  RightNav,
} from "@/app/[locale]/(protected)/@modal/(.)stories/create/_components";

function CreateStoryPage() {
  const router = useRouter();
  const { hasContent, type } = useCreateData();

  function handleClose() {
    router.replace(ROUTE.HOME);
  }

  return (
    <div className="size-full flex">
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
          <DiscardDialog onClose={handleClose} />
        </div>
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
