import { useState } from "react";
import { useCreateData } from "../../_providers/CreateData";

import { cn } from "@/libraries/utils";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export default function ActionButtons({
  className,
}: Readonly<{ className?: string }>) {
  const [isLoading, setIsLoading] = useState(false);
  const { uploadStory } = useCreateData();
  // const handleShare = () => {
  // if (canvasRef.current) {
  // const dataURL = canvasRef.current.toDataURL({
  //   format: "png",
  //   quality: 1,
  //   multiplier: 2,
  // });
  // console.log("Sharing story with data:", dataURL);
  // onShare();
  // }
  // };

  async function handleUploadStory() {
    setIsLoading(true);
    await uploadStory();
    setIsLoading(false);
  }

  return (
    <div className={cn("px-4 pb-6", "flex gap-2", className)}>
      <AlertDialogTrigger asChild>
        <button
          className={cn(
            "flex-1 h-10",
            "text-sm text-card-foreground-dark font-semibold",
            "bg-accent-dark/12 rounded-lg",
            "hover:bg-accent-dark/20 transition-colors ease-in-out",
            "cursor-pointer"
          )}
        >
          Discard
        </button>
      </AlertDialogTrigger>

      <button
        onClick={handleUploadStory}
        className={cn(
          "flex-1 h-10",
          "text-sm text-primary-foreground-dark font-semibold",
          "bg-primary-dark/90 rounded-lg",
          "hover:bg-primary-dark transition-colors ease-in-out",
          "disabled:opacity-50",
          "cursor-pointer"
        )}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Upload"}
      </button>
    </div>
  );
}
