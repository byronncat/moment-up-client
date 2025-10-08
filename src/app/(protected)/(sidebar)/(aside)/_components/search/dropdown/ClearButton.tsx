import { cn } from "@/libraries/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ClearButtonProps = {
  onClear: () => void;
};

export default function ClearButton({ onClear }: ClearButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className={cn(
            "text-xs font-semibold text-primary",
            "cursor-pointer",
            "hover:bg-primary/10 px-1.5 py-1 rounded-lg",
            "transition-colors duration-150 ease-in-out"
          )}
        >
          Clear all
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear search history</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to clear all your recent searches? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClear}>Clear</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
