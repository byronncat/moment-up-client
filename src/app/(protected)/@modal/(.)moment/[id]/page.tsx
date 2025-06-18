"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMoment } from "@/components/providers/MomentData";

import { cn } from "@/libraries/utils";
import { Modal } from "@/components";
import { Button } from "@/components/ui/button";
import { MediaCarousel, Details } from "./_components";
import { X } from "lucide-react";

export default function MomentModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getCurrentMoment, like, bookmark, report, share, follow, block } =
    useMoment();

  const page = searchParams.get("page");
  const initialIndex = page ? parseInt(page) : 0;
  const moment = getCurrentMoment();
  const haveMedia = moment?.post.files && moment.post.files.length > 0;

  function handleClose() {
    router.back();
  }

  if (!moment) return null;
  return (
    <Modal
      onClose={haveMedia ? undefined : handleClose}
      className="flex items-center justify-center"
    >
      {haveMedia && (
        <>
          <MediaCarousel
            files={moment.post.files}
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
        actions={{
          like,
          bookmark,
          report,
          share,
          follow,
          block,
        }}
        onClose={haveMedia ? undefined : handleClose}
        className={cn(
          "border-l border-border shrink-0",
          haveMedia ? "w-[360px]" : "w-full max-w-[600px] border-r"
        )}
      />
    </Modal>
  );
}
