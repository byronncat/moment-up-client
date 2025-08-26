import type { UploadMediaFile } from "../../types";

import { useState, useCallback } from "react";
import { useMomentData, MAX_FILES_LIMIT } from "../../_provider/MomentData";
import { cn } from "@/libraries/utils";

import Image from "next/image";
import { X, Plus } from "@/components/icons";
import { Button } from "@/components/ui/button";

type MediaViewProps = Readonly<{
  onBrowse: () => void;
}>;

export default function MediaView({ onBrowse }: MediaViewProps) {
  const { files, setFiles, setPhase } = useMomentData();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleItemDragStart = useCallback(
    (event: React.DragEvent, index: number) => {
      setDraggedIndex(index);
      event.dataTransfer.effectAllowed = "move";
    },
    [setDraggedIndex]
  );

  const handleItemDragOver = useCallback(
    (event: React.DragEvent, index: number) => {
      event.preventDefault();
      event.stopPropagation();
      setDragOverIndex(index);
    },
    [setDragOverIndex]
  );

  const handleItemDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, [setDragOverIndex]);

  const handleItemDrop = useCallback(
    (event: React.DragEvent, dropIndex: number) => {
      event.preventDefault();
      event.stopPropagation();

      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        const draggedFile = newFiles[draggedIndex];
        newFiles.splice(draggedIndex, 1);
        newFiles.splice(dropIndex, 0, draggedFile);
        return newFiles;
      });

      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [draggedIndex, setFiles]
  );

  const handleItemDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  return (
    <div
      className={cn(
        "w-[90vh] max-w-full max-h-[90vh]",
        "relative bg-background"
      )}
    >
      <div
        className={cn(
          "overflow-y-auto scrollbar-hide size-full",
          "h-full max-h-[90vh]"
        )}
      >
        <div
          className={cn(
            "size-full p-3 pb-14",
            "grid grid-cols-2 md:grid-cols-3 gap-2"
          )}
        >
          {files.map((file, index) => (
            <MediaItem
              key={file.id}
              file={file}
              index={index}
              draggedIndex={draggedIndex}
              dragOverIndex={dragOverIndex}
              handleItemDragStart={handleItemDragStart}
              handleItemDragOver={handleItemDragOver}
              handleItemDragLeave={handleItemDragLeave}
              handleItemDrop={handleItemDrop}
              handleItemDragEnd={handleItemDragEnd}
            />
          ))}

          {files.length < MAX_FILES_LIMIT && (
            <div className="p-2 w-full aspect-square">
              <button
                type="button"
                onClick={onBrowse}
                className={cn(
                  "group size-full rounded-lg",
                  "border-2 border-dashed border-muted-foreground/40 hover:border-muted-foreground/50",
                  "transition-colors duration-150",
                  "cursor-pointer",
                  "flex flex-col items-center justify-center gap-2",
                  "bg-muted/30 hover:bg-muted/50"
                )}
              >
                <Plus
                  className={cn(
                    "size-8",
                    "fill-muted-foreground/40 group-hover:fill-muted-foreground/50",
                    "transition-colors duration-150"
                  )}
                />
                <span
                  className={cn(
                    "text-xs",
                    "text-muted-foreground/40 group-hover:text-muted-foreground/50",
                    "transition-colors duration-150"
                  )}
                >
                  Add more
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <Button
        type="button"
        className="absolute bottom-4 right-3"
        onClick={() => setPhase("preview")}
      >
        Preview
      </Button>
    </div>
  );
}

type MediaItemProps = Readonly<{
  file: UploadMediaFile;
  index: number;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  handleItemDragStart: (event: React.DragEvent, index: number) => void;
  handleItemDragOver: (event: React.DragEvent, index: number) => void;
  handleItemDragLeave: () => void;
  handleItemDrop: (event: React.DragEvent, index: number) => void;
  handleItemDragEnd: () => void;
}>;

const isImage = (file: UploadMediaFile) => file.type.startsWith("image/");
const isVideo = (file: UploadMediaFile) => file.type.startsWith("video/");

function MediaItem({
  file,
  index,
  draggedIndex,
  dragOverIndex,
  handleItemDragStart,
  handleItemDragOver,
  handleItemDragLeave,
  handleItemDrop,
  handleItemDragEnd,
}: MediaItemProps) {
  const { removeFile } = useMomentData();

  return (
    <div
      draggable
      onDragStart={(event) => handleItemDragStart(event, index)}
      onDragOver={(event) => handleItemDragOver(event, index)}
      onDragLeave={handleItemDragLeave}
      onDrop={(event) => handleItemDrop(event, index)}
      onDragEnd={handleItemDragEnd}
      className={cn(
        "group cursor-move",
        "transition-all duration-200",
        draggedIndex === index && "opacity-50 scale-95",
        dragOverIndex === index && draggedIndex !== index && "scale-105",
        "hover:scale-102"
      )}
    >
      <div className="p-2">
        <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
          {isImage(file) ? (
            <Image
              src={file.previewUrl}
              alt={file.name}
              fill
              className="object-cover object-top"
            />
          ) : isVideo(file) ? (
            <video
              src={file.previewUrl}
              className="w-full h-full object-cover"
              muted
            />
          ) : null}

          <div
            className={cn(
              "absolute inset-0 bg-black/30",
              "flex items-center justify-center",
              "opacity-0 group-hover:opacity-100",
              "transition-opacity"
            )}
          >
            <div
              className={cn(
                "text-white text-xs",
                "bg-black/60 px-2 py-1 rounded"
              )}
            >
              Drag to reorder
            </div>
          </div>

          <button
            onClick={() => removeFile(index)}
            className={cn(
              "absolute top-2 right-2",
              "p-1 rounded-full bg-black/50 text-white",
              "transition-opacity hover:bg-black/70",
              "cursor-pointer"
            )}
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
