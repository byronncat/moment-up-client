/* eslint-disable react/no-array-index-key */
import type { FeedItemDto } from "api";

import { cn } from "@/libraries/utils";
import { AspectRatio } from "../../../ui/aspect-ratio";
import { CardContent } from "../../../ui/card";
import MediaItem from "./MediaItem";
import { getRatioValue } from "./aspectRatio.helper";

const MAX_LENGTH = 5;

type MediaGridProps = Readonly<{
  files: FeedItemDto["post"]["files"];
  postId: string;
}>;

export default function MediaGrid({ files, postId }: MediaGridProps) {
  if (!files || files.length === 0) return null;
  const firstImageHorizontal = files[0].aspectRatio === "landscape";

  let grid = null;
  switch (files.length) {
    case 1:
      grid = (
        <AspectRatio
          ratio={getRatioValue(files[0].aspectRatio)}
          className="relative"
        >
          <MediaItem file={files[0]} index={0} postId={postId} />
        </AspectRatio>
      );
      break;
    case 2:
      grid = (
        <AspectRatio
          ratio={1}
          className={cn(
            "grid gap-1",
            firstImageHorizontal ? "grid-rows-2" : "grid-cols-2"
          )}
        >
          <MediaItem file={files[0]} index={0} postId={postId} />
          <MediaItem file={files[1]} index={1} postId={postId} />
        </AspectRatio>
      );
      break;
    case 3:
      grid = (
        <AspectRatio
          ratio={1}
          className={cn(
            "grid gap-1",
            firstImageHorizontal ? "grid-rows-2" : "grid-cols-2"
          )}
        >
          <MediaItem file={files[0]} index={0} postId={postId} />
          <div
            className={cn(
              "grid gap-1",
              firstImageHorizontal ? "grid-cols-2" : "grid-rows-2"
            )}
          >
            <MediaItem file={files[1]} index={1} postId={postId} />
            <MediaItem file={files[2]} index={2} postId={postId} />
          </div>
        </AspectRatio>
      );
      break;
    case 4:
      grid = (
        <AspectRatio ratio={1} className="grid gap-1 grid-cols-2 grid-rows-2">
          {files.map((file, index) => (
            <MediaItem key={index} file={file} index={index} postId={postId} />
          ))}
        </AspectRatio>
      );
      break;
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
            <MediaItem file={files[0]} index={0} postId={postId} />
            <MediaItem file={files[1]} index={1} postId={postId} />
          </div>

          <div
            className={cn(
              "grid gap-1",
              firstImageHorizontal ? "grid-cols-3" : "grid-rows-3"
            )}
          >
            {files.slice(2, MAX_LENGTH).map((file, index) => (
              <div key={index + 2} className="relative">
                <MediaItem file={file} index={index + 2} postId={postId} />
                {index === 2 && files.length > MAX_LENGTH && (
                  <MoreItemsOverlay count={files.length - MAX_LENGTH} />
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
        "flex items-center justify-center",
        "pointer-events-none"
      )}
    >
      <span className="text-white text-2xl font-semibold">+{count}</span>
    </div>
  );
}
