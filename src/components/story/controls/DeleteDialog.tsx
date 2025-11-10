import { useRef } from "react";
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

type DeleteDialogProps = {
  isPlaying: boolean;
  onPause: () => void;
  onPlay: () => void;
  onDelete: () => void;
};

export default function DeleteDialog({
  isPlaying,
  onPause,
  onPlay,
  onDelete,
}: DeleteDialogProps) {
  const wasPlayingRef = useRef(false);

  function handleOpenAutoFocus(_event: Event) {
    if (isPlaying) {
      wasPlayingRef.current = true;
      onPause();
    } else wasPlayingRef.current = false;
  }

  function handleCloseAutoFocus() {
    if (wasPlayingRef.current) onPlay();
  }

  return (
    <AlertDialogContent
      className="bg-card-dark border-border-dark"
      disablePortal
      onOpenAutoFocus={handleOpenAutoFocus}
      onCloseAutoFocus={handleCloseAutoFocus}
    >
      <AlertDialogHeader>
        <AlertDialogTitle className="text-card-foreground-dark">
          Delete story?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-muted-foreground-dark">
          Are you sure you want to delete this story? This action cannot be
          undone.
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
          onClick={onDelete}
          className={cn(
            "bg-destructive-dark text-destructive-foreground-dark",
            "hover:bg-[#ff8282]"
          )}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
