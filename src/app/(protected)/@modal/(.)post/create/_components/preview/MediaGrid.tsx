import type { UploadMediaFile } from "../../types";

import { usePostData } from "../../_provider/PostData";
import { cn } from "@/libraries/utils";

import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getRatioValue } from "@/components/post/feed/media-grid/aspectRatio.helper";
import { Play } from "@/components/icons";
import { BLUR_DATA_URL } from "@/constants/client";

const FIRST = 0;
const SECOND = 1;
const THIRD = 2;
const MAX = 5;

export default function MediaGrid() {
  const { files } = usePostData();
  if (!files?.length) return null;

  const firstImageHorizontal = files[FIRST].aspectRatio === "landscape";

  let grid = null;
  const fileCount = files.length;
  switch (fileCount) {
    case 1:
      grid = (
        <AspectRatio
          ratio={getRatioValue(files[FIRST].aspectRatio)}
          className="relative"
        >
          <MediaItem file={files[FIRST]} index={FIRST} />
        </AspectRatio>
      );
    case 2:
      grid = (
        <AspectRatio
          ratio={1}
          className={cn(
            "grid gap-1",
            firstImageHorizontal ? "grid-rows-2" : "grid-cols-2"
          )}
        >
          <MediaItem file={files[FIRST]} index={FIRST} />
          <MediaItem file={files[SECOND]} index={SECOND} />
        </AspectRatio>
      );
    case 3:
      grid = (
        <AspectRatio
          ratio={1}
          className={cn(
            "grid gap-1",
            firstImageHorizontal ? "grid-rows-2" : "grid-cols-2"
          )}
        >
          <MediaItem file={files[FIRST]} index={FIRST} />
          <div
            className={cn(
              "grid gap-1",
              firstImageHorizontal ? "grid-cols-2" : "grid-rows-2"
            )}
          >
            <MediaItem file={files[SECOND]} index={SECOND} />
            <MediaItem file={files[THIRD]} index={THIRD} />
          </div>
        </AspectRatio>
      );
    case 4:
      grid = (
        <AspectRatio ratio={1} className="grid gap-1 grid-cols-2 grid-rows-2">
          {files.map((file, index) => (
            <MediaItem key={file.id} file={file} index={index} />
          ))}
        </AspectRatio>
      );
    default:
      grid = (
        <AspectRatio
          ratio={1}
          className={cn(
            "grid gap-1",
            firstImageHorizontal ? "grid-rows-2" : "grid-cols-2"
          )}
        >
          <div
            className={cn(
              "grid gap-1",
              firstImageHorizontal ? "grid-cols-2" : "grid-rows-2"
            )}
          >
            <div className="relative">
              <MediaItem file={files[FIRST]} index={FIRST} />
            </div>
            <div className="relative">
              <MediaItem file={files[SECOND]} index={SECOND} />
            </div>
          </div>
          <div
            className={cn(
              "grid gap-1",
              firstImageHorizontal ? "grid-cols-3" : "grid-rows-3"
            )}
          >
            {files.slice(THIRD, MAX).map((file, index) => (
              <div key={file.id} className="relative">
                <MediaItem file={file} index={index + THIRD} />
                {index === 0 && files.length > MAX && (
                  <MoreItemsOverlay count={files.length - MAX} />
                )}
              </div>
            ))}
          </div>
        </AspectRatio>
      );
  }

  return <CardContent className="p-0">{grid}</CardContent>;
}

function MoreItemsOverlay({ count }: Readonly<{ count: number }>) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-black/50",
        "flex items-center justify-center"
      )}
    >
      <span className="text-white text-2xl font-semibold">+{count}</span>
    </div>
  );
}

type MediaItemProps = Readonly<{
  file: UploadMediaFile;
  index: number;
}>;

function MediaItem({ file, index }: MediaItemProps) {
  const getFileType = (file: UploadMediaFile): "image" | "video" | "audio" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "audio";
  };

  const fileType = getFileType(file);

  return (
    <div className="relative size-full">
      {fileType === "image" ? (
        <Image
          src={file.previewUrl}
          alt={`Image ${index + 1}`}
          fill
          sizes="(max-width: 720px) 100vw, 600px"
          className="object-cover object-top select-none"
          loading="lazy"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      ) : fileType === "video" ? (
        <VideoItem url={file.previewUrl} />
      ) : null}
    </div>
  );
}

const VideoItem = function VideoItem({ url }: Readonly<{ url: string }>) {
  return (
    <>
      <video
        src={url}
        className="absolute inset-0 size-full object-cover"
        playsInline
        preload="metadata"
        muted
      />
      <div
        className={cn(
          "absolute inset-0",
          "flex items-center justify-center",
          "pointer-events-none",
          "bg-black/50"
        )}
      >
        <Play className="size-12 fill-white/80" />
      </div>
    </>
  );
};
