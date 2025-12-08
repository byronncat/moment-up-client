import { type DragEvent, useCallback, useState } from "react";
import { MAX_FILES_LIMIT, usePostData } from "../../_provider/PostData";
import { toast } from "sonner";
import { cn } from "@/libraries/utils";
import { Image as ImageIcon } from "@/components/icons";

type UploadViewProps = Readonly<{
  onBrowse: () => void;
}>;

export default function UploadView({ onBrowse }: UploadViewProps) {
  const { addFiles } = usePostData();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const droppedFiles = Array.from(event.dataTransfer.files);
      const validFiles = droppedFiles.filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("video/")
      );

      const invalidFiles = droppedFiles.length - validFiles.length;
      const result = await addFiles(validFiles);

      if (result.rejected > 0)
        toast.error(
          `${result.rejected} file${result.rejected > 1 ? "s" : ""} rejected - maximum limit is ${MAX_FILES_LIMIT} files`
        );

      if (invalidFiles > 0)
        toast.warning(
          `${invalidFiles} file${invalidFiles > 1 ? "s" : ""} skipped - only images and videos are supported`
        );
    },
    [addFiles]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onBrowse}
      className={cn(
        "group p-1 bg-background cursor-pointer",
        "h-[calc(100svh-48px)] sm:h-auto sm:aspect-square w-[90vh] max-w-full",
        "transition-all duration-150 ease-in-out",
        "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
        isDragOver && "bg-muted"
      )}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onBrowse();
      }}
    >
      <div
        className={cn(
          "size-full",
          "flex flex-col justify-center items-center",
          "border-accent/70 border-2 border-dashed sm:rounded-b-lg",
          "opacity-70 group-hover:opacity-100",
          "transition-opacity duration-150 ease-in-out"
        )}
      >
        <ImageIcon multiple className="size-20 mb-3 text-muted-foreground" />
        <Description isDragOver={isDragOver} />
      </div>
    </div>
  );
}

function Description({ isDragOver }: Readonly<{ isDragOver: boolean }>) {
  return (
    <div className={cn("text-sm text-muted-foreground text-center", "mb-2")}>
      <p>{isDragOver ? "Drop files here" : "Drag and drop photos or videos"}</p>

      <p>or click to browse</p>

      <p className="text-xs text-muted-foreground mt-2">
        Majorly supports: JPG, PNG, MP4
      </p>
    </div>
  );
}
