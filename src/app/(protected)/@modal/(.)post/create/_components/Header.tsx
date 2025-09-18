import type { PhaseData } from "../types";

import { usePostData } from "../_provider/PostData";
import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { PaperPlane, X } from "@/components/icons";

type HeaderProps = Readonly<{
  data: PhaseData;
  handleClose: () => void;
  className?: string;
}>;

export default function Header({ data, handleClose, className }: HeaderProps) {
  const { phase, upload } = usePostData();

  return (
    <div
      className={cn(
        "px-3 h-12 relative",
        "flex items-center justify-between",
        "border-b border-border",
        "shadow-sm",
        className
      )}
    >
      <div className="flex justify-start items-center gap-1">
        {data.buttons?.map((button) => (
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
        <Button
          onClick={handleClose}
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
            onClick={upload}
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
      </div>
    </div>
  );
}
