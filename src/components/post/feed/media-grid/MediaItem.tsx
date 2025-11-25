import { __parseUrl } from "@/__mocks__";
import type { FeedItemDto } from "api";

import { useRef, useState } from "react";
import { parseMediaUrl } from "@/helpers/cloudinary";
import { ROUTE } from "@/constants/route";
import { BLUR_DATA_URL } from "@/constants/client";

import { cn } from "@/libraries/utils";
import Image from "next/image";
import Link from "next/link";
import { Play } from "../../../icons";

type MediaItemProps = Readonly<{
  file: NonNullable<FeedItemDto["post"]["files"]>[0];
  index: number;
  postId: string;
  className?: string;
}>;

// TEMPORARY, DON'T DELETE
const mode: "optimized" | "default" = "default";

export default function MediaItem({
  file,
  index,
  postId,
  className,
}: MediaItemProps) {
  return (
    <Link href={ROUTE.POST(postId, index)} className={className} tabIndex={-1}>
      <div className="relative size-full">
        {file.type === "image" ? (
          <Image
            src={__parseUrl(file.id, "image", 640) as string}
            alt={`Post ${index + 1}`}
            fill
            sizes="(max-width: 720px) 100vw, 600px"
            className="object-cover object-top select-none"
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        ) : mode === "optimized" ? (
          <OptimizedVideoItem fileId={file.id} index={index} />
        ) : (
          <DefaultVideoItem fileId={file.id} />
        )}
      </div>
    </Link>
  );
}

function OptimizedVideoItem({
  fileId,
  index,
}: Readonly<{ fileId: string; index: number }>) {
  const thumbnailUrl = parseMediaUrl(fileId, "video-thumbnail", {
    width: 640,
    height: 640,
    startOffset: 0, // Extract first frame
    quality: "auto",
    format: "jpg",
  });

  return (
    <>
      <Image
        src={thumbnailUrl as string}
        alt={`Video ${index + 1}`}
        fill
        sizes="(max-width: 720px) 100vw, 600px"
        className="object-cover object-top select-none"
        loading="lazy"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
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
}

function DefaultVideoItem({ fileId }: Readonly<{ fileId: string }>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Ignore play errors (e.g., user interaction required)
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const videoUrl = __parseUrl(fileId, "video", 640);

  return (
    <>
      <video
        ref={videoRef}
        src={videoUrl as string}
        className="absolute inset-0 size-full object-cover select-none"
        playsInline
        muted
        loop
        preload="metadata"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {!isHovering && (
        <div
          className={cn(
            "absolute inset-0",
            "flex items-center justify-center",
            "pointer-events-none",
            "bg-black/50",
            "transition-opacity duration-200"
          )}
        >
          <Play className="size-12 fill-white/80" />
        </div>
      )}
    </>
  );
}
