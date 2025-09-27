import { __parseUrl } from "@/__mocks__";
import type { FeedItemDto } from "api";

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

export default function MediaItem({
  file,
  index,
  postId,
  className,
}: MediaItemProps) {
  return (
    <Link href={ROUTE.POST(postId, index)} className={className}>
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
        ) : (
          <VideoItem url={__parseUrl(file.id, "video", 640) as string} />
        )}
      </div>
    </Link>
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
