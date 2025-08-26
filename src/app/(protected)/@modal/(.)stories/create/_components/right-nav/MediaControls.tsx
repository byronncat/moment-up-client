import { useCanvas } from "../../_providers";
import { cn } from "@/libraries/utils";

const ButtonStyles = cn(
  "flex-1 h-8",
  "text-sm text-white font-medium",
  "bg-accent-dark/[.12] rounded-lg",
  "hover:bg-accent-dark/[.20]",
  "border border-border-dark",
  "cursor-pointer",
  "transition-colors ease-in-out"
);

type MediaControlsProps = Readonly<{
  className?: string;
}>;

export default function MediaControls({ className }: MediaControlsProps) {
  const { addText, deleteSelected } = useCanvas();

  return (
    <div className={cn("flex gap-2", className)}>
      <button className={ButtonStyles} onClick={addText}>
        Add Text
      </button>
      <button className={ButtonStyles} onClick={deleteSelected}>
        Delete Selected
      </button>
    </div>
  );
}
