import { useRef } from "react";
import { cn } from "@/libraries/utils";
import { useCreateData } from "../../../_providers";
import { SquarePlus as Upload } from "@/components/icons";

type UploadZoneProps = Readonly<{
  className?: string;
}>;

export default function UploadZone({ className }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAudio } = useCreateData();

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) uploadAudio(file);
  }

  function handleBrowse() {
    fileInputRef.current?.click();
  }

  return (
    <div className={className}>
      <input
        type="file"
        accept="audio/*"
        onChange={handleUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <button
        onClick={handleBrowse}
        className={cn(
          "w-full p-4",
          "flex flex-col items-center",
          "rounded-lg border-2 border-dashed",
          "bg-card-dark hover:bg-accent-dark/8",
          "text-muted-foreground-dark hover:text-white",
          "border-border-dark hover:border-accent-dark/50",
          "transition-colors duration-200",
          "cursor-pointer"
        )}
      >
        <Upload className="size-6" />
        <span className="text-sm font-medium mt-2">Upload Audio</span>
        <span className="text-xs opacity-70">MP3, WAV, M4A</span>
      </button>
    </div>
  );
}
