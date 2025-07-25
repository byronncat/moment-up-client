import type { MomentInfo } from "api";

import { cn } from "@/libraries/utils";
import { AspectRatio } from "../../../ui/aspect-ratio";
import { CardContent } from "../../../ui/card";
import MediaItem from "./MediaItem";
import { AspectRatioHelper } from "./aspectRatio.helper";

type MediaGridProps = Readonly<{
  files: MomentInfo["post"]["files"];
  momentId: string;
}>;

export default function MediaGrid({ files, momentId }: MediaGridProps) {
  if (!files) return null;
  const firstImageHorizontal = AspectRatioHelper.isHorizontal(
    files[0].aspectRatio
  );

  const Grid = () => {
    const fileCount = files.length;
    switch (fileCount) {
      case 1:
        return (
          <AspectRatio
            ratio={AspectRatioHelper.getValue(files[0].aspectRatio)}
            className="relative"
          >
            <MediaItem file={files[0]} index={0} momentId={momentId} />
          </AspectRatio>
        );
      case 2:
        return (
          <AspectRatio
            ratio={1}
            className={cn(
              "grid gap-1",
              firstImageHorizontal ? "grid-rows-2" : "grid-cols-2"
            )}
          >
            <MediaItem file={files[0]} index={0} momentId={momentId} />
            <MediaItem file={files[1]} index={1} momentId={momentId} />
          </AspectRatio>
        );
      case 3:
        return (
          <AspectRatio
            ratio={1}
            className={cn(
              "grid gap-1",
              firstImageHorizontal ? "grid-rows-2" : "grid-cols-2"
            )}
          >
            <MediaItem file={files[0]} index={0} momentId={momentId} />
            <div
              className={cn(
                "grid gap-1",
                firstImageHorizontal ? "grid-cols-2" : "grid-rows-2"
              )}
            >
              <MediaItem file={files[1]} index={1} momentId={momentId} />
              <MediaItem file={files[2]} index={2} momentId={momentId} />
            </div>
          </AspectRatio>
        );
      case 4:
        return (
          <AspectRatio ratio={1} className="grid gap-1 grid-cols-2 grid-rows-2">
            {files.map((file, index) => (
              <MediaItem
                key={index}
                file={file}
                index={index}
                momentId={momentId}
              />
            ))}
          </AspectRatio>
        );
      default:
        return (
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
                <MediaItem file={files[0]} index={0} momentId={momentId} />
              </div>
              <div className="relative">
                <MediaItem file={files[1]} index={1} momentId={momentId} />
              </div>
            </div>
            <div
              className={cn(
                "grid gap-1",
                firstImageHorizontal ? "grid-cols-3" : "grid-rows-3"
              )}
            >
              {files.slice(2, 5).map((file, index) => (
                <div key={index + 2} className="relative">
                  <MediaItem
                    file={file}
                    index={index + 2}
                    momentId={momentId}
                  />
                  {index === 2 && files.length > 5 && (
                    <MoreItemsOverlay count={files.length - 5} />
                  )}
                </div>
              ))}
            </div>
          </AspectRatio>
        );
    }
  };

  return (
    <CardContent className="p-0">
      <Grid />
    </CardContent>
  );
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
