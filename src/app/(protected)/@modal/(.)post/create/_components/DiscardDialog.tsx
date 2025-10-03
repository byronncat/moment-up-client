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

type DiscardDialogProps = Readonly<{
  onCancel: () => void;
  onClose: () => void;
}>;

export default function DiscardDialog({
  onCancel,
  onClose,
}: DiscardDialogProps) {
  return (
    <AlertDialogContent portalDisabled>
      <AlertDialogHeader>
        <AlertDialogTitle>Discard post?</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to discard this post? Your post won&apos;t be
          saved.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onClose}
          className={cn(
            "bg-destructive text-destructive-foreground",
            "hover:bg-[#ff8282]"
          )}
        >
          Discard
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
