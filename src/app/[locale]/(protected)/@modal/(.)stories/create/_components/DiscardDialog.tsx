import { cn } from "@/libraries/utils";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DiscardDialogProps = {
  disablePortal?: boolean;
  onClose: () => void;
};

export default function DiscardDialog({
  disablePortal = false,
  onClose,
}: DiscardDialogProps) {
  return (
    <AlertDialogContent
      className="bg-card-dark border-border-dark"
      disablePortal={disablePortal}
    >
      <AlertDialogHeader>
        <AlertDialogTitle className="text-card-foreground-dark">
          Discard story?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-muted-foreground-dark">
          Are you sure you want to discard this story? Your story won&apos;t be
          saved.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel
          className={cn(
            "bg-accent-dark/12 hover:bg-accent-dark/20",
            "text-card-foreground-dark hover:text-card-foreground-dark",
            "border-border-dark "
          )}
        >
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={onClose}
          className={cn(
            "bg-destructive-dark text-destructive-foreground-dark",
            "hover:bg-[#ff8282]"
          )}
        >
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
