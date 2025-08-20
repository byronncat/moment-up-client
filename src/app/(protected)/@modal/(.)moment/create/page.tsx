"use client";

import { cn } from "@/libraries/utils";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/common";
import { UploadMediaWindow } from "./_components";
import MomentDataProvider from "./_provider/MomentData";

export default function CreateMomentPage() {
  const router = useRouter();

  function handleClose() {
    router.back();
  }

  return (
    <Modal onClose={handleClose} className="flex items-center justify-center">
      <div
        className={cn("flex flex-col", "bg-card rounded-2xl overflow-hidden")}
      >
        <h1
          className={cn(
            "text-lg font-semibold text-center py-2",
            "border-b border-border shadow-sm"
          )}
        >
          Create Moment
        </h1>
        <MomentDataProvider>
          <UploadMediaWindow />
        </MomentDataProvider>
      </div>
    </Modal>
  );
}
