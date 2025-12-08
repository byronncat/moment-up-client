import { useRef } from "react";
import { useCreateData } from "../../../_providers";

import { cn } from "@/libraries/utils";
import { SquarePlus as Upload } from "@/components/icons";

export default function UploadZone({
  className,
}: Readonly<{
  className?: string;
}>) {
  const { uploadAudio } = useCreateData();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        id="audio-upload"
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
          "bg-input-dark/50 hover:bg-input-dark/70",
          "text-muted-foreground-dark hover:text-white/80",
          "border-border-dark hover:border-muted-foreground-dark/50",
          "transition-colors duration-200",
          "cursor-pointer"
        )}
      >
        <Upload className="size-6" />
        <span className="text-sm font-semibold mt-2">Upload Audio</span>
        <span className="text-xs opacity-70">MP3, WAV, M4A</span>
      </button>
    </div>
  );
}
