import type { MomentInfo } from "api";
import Format from "@/utilities/format";
import { ROUTE } from "@/constants/route";
import { BLUR_DATA_URL, FIRST } from "@/constants/clientConfig";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/libraries/utils";
import { Heart, Message, Clone, Video } from "@/components/icons";

type MomentCellProps = Readonly<{
  data: MomentInfo;
  onClick?: () => void;
  className?: string;
}>;

export default function MomentCell({
  data,
  onClick,
  className,
}: MomentCellProps) {
  if (!data.post.files || data.post.files.length === 0) return null;
  const coverFile = data.post.files[FIRST];

  return (
    <div
      className={cn("relative group", "shadow-lg overflow-hidden", className)}
      onClick={onClick}
      role="button"
    >
      <div className={cn("bg-card aspect-square", "relative")}>
        {coverFile.type === "image" ? (
          <Image
            src={coverFile.url}
            alt={data.post.text || "Moment image"}
            fill
            sizes="240px"
            className="size-full object-cover object-top select-none"
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        ) : (
          <video
            src={coverFile.url}
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
          id={data.id}
          isLiked={data.post.isLiked}
          likes={data.post.likes}
          comments={data.post.comments}
        />
      </div>
    </div>
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
  id: MomentInfo["id"];
  isLiked: boolean;
  likes: number;
  comments: number;
}>;

function HoverOverlay({ id, isLiked, likes, comments }: HoverOverlayProps) {
  return (
    <Link
      href={ROUTE.MOMENT(id)}
      className={cn(
        "absolute inset-0 bg-black/50",
        "hidden group-hover:flex",
        "items-center justify-center"
      )}
    >
      <div className="flex gap-6 text-white font-semibold">
        <div className="flex items-center gap-2">
          <Heart
            className="size-6 fill-red-500"
            type={isLiked ? "solid" : "regular"}
          />
          <span>{Format.number(likes)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Message className="size-6 fill-white" type="solid" />
          <span>{Format.number(comments)}</span>
        </div>
      </div>
    </Link>
  );
}
