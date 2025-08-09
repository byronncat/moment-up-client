"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMoment } from "@/components/providers/MomentStorage";

import { cn } from "@/libraries/utils";
import { Modal } from "@/components/common";
import { Button } from "@/components/ui/button";
import { MediaCarousel, Details } from "./_components";
import { X } from "@/components/icons";

export default function MomentModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getCurrentMoment } = useMoment();

  const imgIndex = searchParams.get("imgIndex");
  const initialIndex = imgIndex ? parseInt(imgIndex) : 0;
  const moment = getCurrentMoment();
  const haveMedia = moment?.post.files && moment.post.files.length > 0;

  function handleClose() {
    router.back();
  }

  if (!moment) return null;
  return (
    <Modal
      onClose={haveMedia ? undefined : handleClose}
      className={cn(
        "flex",
        "flex-col md:flex-row md:items-center md:justify-center",
        "overflow-y-auto"
      )}
    >
      {haveMedia && (
        <>
          <MediaCarousel
            files={moment.post.files!}
            initialIndex={initialIndex}
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full", "absolute left-2 top-2")}
            onClick={handleClose}
          >
            <X />
          </Button>
        </>
      )}
      <Details
        data={moment}
        onClose={handleClose}
        haveMedia={haveMedia}
        className="shrink-0"
      />
    </Modal>
  );
}
