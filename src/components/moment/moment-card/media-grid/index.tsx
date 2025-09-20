import type { FeedItemDto } from "api";

import { cn } from "@/libraries/utils";
import { AspectRatio } from "../../../ui/aspect-ratio";
import { CardContent } from "../../../ui/card";
import MediaItem from "./MediaItem";
import { AspectRatioHelper } from "./aspectRatio.helper";

const FIRST = 0;
const SECOND = 1;
const THIRD = 2;
const MAX = 5;

type MediaGridProps = Readonly<{
  files: FeedItemDto["post"]["files"];
  momentId: string;
}>;

export default function MediaGrid({ files, momentId }: MediaGridProps) {
  if (!files) return null;
  const firstImageHorizontal = AspectRatioHelper.isHorizontal(
    files[FIRST].aspectRatio
  );

  const Grid = () => {
    const fileCount = files.length;
    switch (fileCount) {
      case 1:
        return (
          <AspectRatio
            ratio={AspectRatioHelper.getValue(files[FIRST].aspectRatio)}
            className="relative"
          >
            <MediaItem file={files[FIRST]} index={FIRST} momentId={momentId} />
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
            <MediaItem file={files[FIRST]} index={FIRST} momentId={momentId} />
            <MediaItem
              file={files[SECOND]}
              index={SECOND}
              momentId={momentId}
            />
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
            <MediaItem file={files[FIRST]} index={FIRST} momentId={momentId} />
            <div
              className={cn(
                "grid gap-1",
                firstImageHorizontal ? "grid-cols-2" : "grid-rows-2"
              )}
            >
              <MediaItem
                file={files[SECOND]}
                index={SECOND}
                momentId={momentId}
              />
              <MediaItem
                file={files[THIRD]}
                index={THIRD}
                momentId={momentId}
              />
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
                <MediaItem
                  file={files[FIRST]}
                  index={FIRST}
                  momentId={momentId}
                />
              </div>
              <div className="relative">
                <MediaItem
                  file={files[SECOND]}
                  index={SECOND}
                  momentId={momentId}
                />
              </div>
            </div>
            <div
              className={cn(
                "grid gap-1",
                firstImageHorizontal ? "grid-cols-3" : "grid-rows-3"
              )}
            >
              {files.slice(THIRD, MAX).map((file, index) => (
                <div key={index + THIRD} className="relative">
                  <MediaItem
                    file={file}
                    index={index + THIRD}
                    momentId={momentId}
                  />
                  {index === THIRD && files.length > MAX && (
                    <MoreItemsOverlay count={files.length - MAX} />
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
