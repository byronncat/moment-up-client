import { useRef } from "react";
import { useCanvas } from "../../_providers";
import { cn } from "@/libraries/utils";

const ButtonStyles = cn(
  "flex-1 h-10",
  "text-sm text-white font-medium",
  "bg-accent-dark/12 rounded-lg",
  "hover:bg-accent-dark/20",
  "border border-border-dark",
  "cursor-pointer",
  "transition-colors ease-in-out"
);

type MediaControlsProps = Readonly<{
  className?: string;
}>;

export default function MediaControls({ className }: MediaControlsProps) {
  const { addText, addImage, deleteSelected } = useCanvas();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
      addImage(file);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <button className={ButtonStyles} onClick={addText}>
        Add text
      </button>
      <button
        className={ButtonStyles}
        onClick={() => fileInputRef.current?.click()}
      >
        Add image
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <button className={ButtonStyles} onClick={deleteSelected}>
        Delete selected
      </button>
    </div>
  );
}
