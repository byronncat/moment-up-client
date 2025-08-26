import { cn } from "@/libraries/utils";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

type ActionButtonsProps = {
  onShare: () => void;
  canvasRef: React.RefObject<any>;
  className?: string;
};

export default function ActionButtons({
  onShare,
  canvasRef,
  className,
}: ActionButtonsProps) {
  const handleShare = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2,
      });
      console.log("Sharing story with data:", dataURL);
      onShare();
    }
  };

  return (
    <div className={cn("px-4 pb-6", "flex gap-2", className)}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex-1 h-10",
            "text-sm text-card-foreground-dark font-semibold",
            "bg-accent-dark/[.12] rounded-lg",
            "hover:bg-accent-dark/[.20] transition-colors ease-in-out",
            "cursor-pointer"
          )}
        >
          Discard
        </button>
      </AlertDialogTrigger>

      <button
        type="button"
        onClick={handleShare}
        className={cn(
          "flex-1 h-10",
          "text-sm text-white font-semibold",
          "bg-primary-dark/90 rounded-lg",
          "hover:bg-primary-dark transition-colors ease-in-out",
          "cursor-pointer"
        )}
      >
        Share to story
      </button>
    </div>
  );
}
