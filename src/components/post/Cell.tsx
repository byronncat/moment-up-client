import { __parseUrl } from "@/__mocks__";
import type { FeedItemDto } from "api";

import Format from "@/utilities/format";
import { ROUTE } from "@/constants/route";
import { BLUR_DATA_URL } from "@/constants/client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/libraries/utils";
import { Clone, Heart, Message, Video } from "@/components/icons";

type MomentCellProps = Readonly<{
  data: FeedItemDto;
  onClick?: () => void;
  className?: string;
}>;

export default function MomentCell({
  data,
  onClick,
  className,
}: MomentCellProps) {
  if (!data.post.files || data.post.files.length === 0) return null;
  const coverFile = data.post.files[0];

  return (
    <Link
      href={ROUTE.POST(data.id)}
      onClick={onClick}
      tabIndex={0}
      className={cn(
        "relative group select-none",
        "shadow-lg overflow-hidden outline-none",
        className
      )}
    >
      <div className={cn("bg-card aspect-square", "relative")}>
        {coverFile.type === "image" ? (
          <Image
            src={__parseUrl(coverFile.id, "image") as string}
            alt={data.post.text ?? "Moment image"}
            fill
            sizes="240px"
            className="size-full object-cover object-top"
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        ) : (
          <video
            src={__parseUrl(coverFile.id, "video") as string}
            className="size-full object-cover"
            playsInline
            preload="metadata"
          />
        )}

        <MediaTypeIndicator
          hasVideo={data.post.files.some((file) => file.type === "video")}
          hasMultiple={data.post.files.length > 1}
        />

        <HoverOverlay
          isLiked={data.post.isLiked}
          likes={data.post.likes}
          comments={data.post.comments}
        />
      </div>
    </Link>
  );
}

type MediaTypeIndicatorProps = Readonly<{
  hasVideo: boolean;
  hasMultiple: boolean;
}>;

function MediaTypeIndicator({
  hasVideo,
  hasMultiple,
}: MediaTypeIndicatorProps) {
  if (!hasVideo && !hasMultiple) return null;

  const icon = hasVideo ? (
    <Video className="size-5 fill-white drop-shadow-md" type="solid" />
  ) : (
    <Clone className="size-5 fill-white drop-shadow-md" type="solid" />
  );

  const label = hasVideo ? "Contains video" : "Multiple files";

  return (
    <span
      className="absolute top-3 right-3 z-10"
      aria-label={label}
      title={label}
    >
      {icon}
    </span>
  );
}

type HoverOverlayProps = Readonly<{
  isLiked: boolean;
  likes: number;
  comments: number;
}>;

function HoverOverlay({ isLiked, likes, comments }: HoverOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-black/50",
        "hidden group-hover:flex group-focus-within:flex",
        "items-center justify-center"
      )}
    >
      <div className="flex gap-6 text-white font-semibold">
        {likes > 0 && (
          <div className="flex items-center gap-2">
            <Heart
              className="size-6 fill-red-500"
              type={isLiked ? "solid" : "regular"}
            />
            <span>{Format.number(likes)}</span>
          </div>
        )}
        {comments > 0 && (
          <div className="flex items-center gap-2">
            <Message className="size-6 fill-white" type="solid" />
            <span>{Format.number(comments)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
