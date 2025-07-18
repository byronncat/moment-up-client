import type { DetailedMomentInfo } from "api";
import { useCallback, memo } from "react";
import { ROUTE } from "@/constants/route";
import { BLUR_DATA_URL } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "../../ui/aspect-ratio";
import { CardContent } from "../../ui/card";
import { Play } from "../../icons";

type MediaGridProps = Readonly<{
  files: DetailedMomentInfo["post"]["files"];
  momentId: string;
}>;

export default function MediaGrid({ files, momentId }: MediaGridProps) {
  const calculateAspectRatio = useCallback((ratioString: string): number => {
    const [width, height] = ratioString.split(":").map(Number);
    return width / height;
  }, []);

  function isHorizontal(ratio: string): boolean {
    const aspectRatio = calculateAspectRatio(ratio);
    return aspectRatio > 1;
  }

  function getAspectRatioValue(ratio: string) {
    switch (ratio) {
      case "1:1":
        return 1;
      case "9:16":
        return 9 / 16;
      case "4:5":
        return 4 / 5;
      case "1.91:1":
        return 1.91 / 1;
      default:
        return 1;
    }
  }

  function renderSingleImage() {
    if (!files) return null;
    const file = files[0];
    return (
      <AspectRatio
        ratio={getAspectRatioValue(file.aspectRatio)}
        className="relative"
      >
        <MediaItem file={file} index={0} momentId={momentId} />
      </AspectRatio>
    );
  }

  function render2Images() {
    if (!files) return null;
    const firstImageHorizontal = isHorizontal(files[0].aspectRatio);

    if (firstImageHorizontal) {
      return (
        <AspectRatio ratio={1} className="grid grid-rows-2 gap-1">
          <MediaItem file={files[0]} index={0} momentId={momentId} />
          <MediaItem file={files[1]} index={1} momentId={momentId} />
        </AspectRatio>
      );
    } else {
      return (
        <AspectRatio ratio={1} className="grid grid-cols-2 gap-1">
          <MediaItem file={files[0]} index={0} momentId={momentId} />
          <MediaItem file={files[1]} index={1} momentId={momentId} />
        </AspectRatio>
      );
    }
  }

  function render3Images() {
    if (!files) return null;
    const firstImageHorizontal = isHorizontal(files[0].aspectRatio);

    if (firstImageHorizontal) {
      return (
        <AspectRatio ratio={1} className="grid grid-rows-2 gap-1">
          <MediaItem file={files[0]} index={0} momentId={momentId} />
          <div className="grid grid-cols-2 gap-1">
            <MediaItem file={files[1]} index={1} momentId={momentId} />
            <MediaItem file={files[2]} index={2} momentId={momentId} />
          </div>
        </AspectRatio>
      );
    } else {
      return (
        <AspectRatio ratio={1} className="grid grid-cols-2 gap-1">
          <MediaItem file={files[0]} index={0} momentId={momentId} />
          <div className="grid grid-rows-2 gap-1">
            <MediaItem file={files[1]} index={1} momentId={momentId} />
            <MediaItem file={files[2]} index={2} momentId={momentId} />
          </div>
        </AspectRatio>
      );
    }
  }

  function render4Images() {
    if (!files) return null;
    return (
      <AspectRatio ratio={1} className="grid grid-cols-2 grid-rows-2 gap-1">
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
  }

  function render5PlusImages() {
    if (!files) return null;
    const firstImageHorizontal = isHorizontal(files[0].aspectRatio);

    if (firstImageHorizontal) {
      return (
        <AspectRatio ratio={1} className="grid grid-rows-2 gap-1">
          <div className="grid grid-cols-2 gap-1">
            <div className="relative">
              <MediaItem file={files[0]} index={0} momentId={momentId} />
            </div>
            <div className="relative">
              <MediaItem file={files[1]} index={1} momentId={momentId} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {files.slice(2, 5).map((file, index) => (
              <div key={index + 2} className="relative">
                <MediaItem file={file} index={index + 2} momentId={momentId} />
                {index === 2 && files.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-sm">
                    <span className="text-white text-2xl font-semibold">
                      +{files.length - 5}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AspectRatio>
      );
    } else {
      return (
        <AspectRatio ratio={1} className="grid grid-cols-2 gap-1">
          <div className="grid grid-rows-2 gap-1">
            <div className="relative">
              <MediaItem file={files[0]} index={0} momentId={momentId} />
            </div>
            <div className="relative">
              <MediaItem file={files[1]} index={1} momentId={momentId} />
            </div>
          </div>
          <div className="grid grid-rows-3 gap-1">
            {files.slice(2, 5).map((file, index) => (
              <div key={index + 2} className="relative">
                <MediaItem file={file} index={index + 2} momentId={momentId} />
                {index === 2 && files.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-sm">
                    <span className="text-white text-2xl font-semibold">
                      +{files.length - 5}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AspectRatio>
      );
    }
  }

  const renderMediaGrid = () => {
    if (!files) return null;
    const fileCount = files.length;

    switch (fileCount) {
      case 1:
        return renderSingleImage();
      case 2:
        return render2Images();
      case 3:
        return render3Images();
      case 4:
        return render4Images();
      default:
        return render5PlusImages();
    }
  };

  if (!files) return null;

  return <CardContent className="p-0">{renderMediaGrid()}</CardContent>;
}

type MediaItemProps = Readonly<{
  file: NonNullable<DetailedMomentInfo["post"]["files"]>[0];
  index: number;
  momentId: string;
  className?: string;
}>;

const VideoItem = memo(function VideoItem({ url }: { url: string }) {
  return (
    <>
      <video
        key={url}
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
});

function MediaItem({ file, index, momentId, className }: MediaItemProps) {
  return (
    <Link href={ROUTE.MOMENT(momentId, index)} className={className}>
      <div className="relative size-full">
        {file.type === "image" ? (
          <Image
            src={file.url}
            alt={`Moment ${index + 1}`}
            fill
            sizes="(max-width: 720px) 100vw, 600px"
            className="object-cover select-none"
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        ) : (
          <VideoItem url={file.url} />
        )}
      </div>
    </Link>
  );
}
