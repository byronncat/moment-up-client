import type { PhaseData } from "../types";

import { useRouter } from "next/navigation";
import { usePostData } from "../_provider/PostData";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { PaperPlane, X } from "@/components/icons";

type HeaderProps = Readonly<{
  data: PhaseData;
  onClose: () => void;
  className?: string;
}>;

export default function Header({ data, onClose, className }: HeaderProps) {
  const router = useRouter();
  const { phase, isUploading, upload } = usePostData();

  async function handleUpload() {
    const success = await upload();
    if (success) {
      if (window.history.length > 1) router.back();
      else router.replace(ROUTE.HOME);
    }
  }

  return (
    <div
      className={cn(
        "px-3 h-12 relative bg-card",
        "flex items-center justify-between",
        "border-b border-border shadow-xs",
        className
      )}
    >
      <div className="flex justify-start items-center gap-1">
        {isUploading
          ? null
          : data.buttons?.map((button) => (
              <Button
                key={button.id}
                onClick={button.onClick}
                variant="ghost"
                size="icon"
                className={cn(
                  "size-8 rounded-full",
                  "font-medium text-muted-foreground",
                  "cursor-pointer focus-visible:text-foreground"
                )}
              >
                {button.icon}
              </Button>
            ))}
      </div>

      <h1
        className={cn(
          "text-md font-semibold text-center",
          "absolute left-1/2 -translate-x-1/2"
        )}
      >
        {data.title}
      </h1>

      <div className="flex justify-end items-center">
        {isUploading ? null : (
          <>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className={cn(
                "size-8 rounded-full",
                "font-medium text-muted-foreground",
                "cursor-pointer focus-visible:text-foreground"
              )}
            >
              <X className="size-4" />
            </Button>
            {phase === "preview" && (
              <Button
                onClick={handleUpload}
                variant="ghost"
                size="icon"
                className={cn(
                  "size-8 rounded-full",
                  "font-medium text-muted-foreground",
                  "cursor-pointer focus-visible:text-foreground"
                )}
              >
                <PaperPlane className="size-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
