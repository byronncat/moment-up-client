import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { X } from "@/components/icons";

const defaultClassName = cn(
  "rounded-full",
  "hover:bg-accent-dark/20",
  "text-muted-foreground-dark hover:text-accent-foreground-dark"
);

type CloseButtonProps = {
  haveContent: boolean;
  onClose: () => void;
  className?: string;
};

export default function CloseButton({
  haveContent,
  onClose,
  className,
}: CloseButtonProps) {
  return haveContent ? (
    <AlertDialogTrigger asChild>
      <Button
        size="icon"
        variant="ghost"
        className={cn(className, defaultClassName)}
      >
        <X className="size-6" />
      </Button>
    </AlertDialogTrigger>
  ) : (
    <Button
      onClick={onClose}
      size="icon"
      variant="ghost"
      className={cn(className, defaultClassName)}
    >
      <X className="size-6" />
    </Button>
  );
}
