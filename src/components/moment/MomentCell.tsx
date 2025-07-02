import type { DetailedMomentInfo } from "api";
import format from "@/utilities/format";
import { ROUTE } from "@/constants/route";
import { BLUR_DATA_URL } from "@/constants/clientConfig";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/libraries/utils";
import { Heart, Message, Clone, Video } from "@/components/icons";

type MomentCellProps = Readonly<{
  data: DetailedMomentInfo;
  onClick?: () => void;
}>;

export default function MomentCell({ data, onClick }: MomentCellProps) {
  if (!data.post.files || data.post.files.length === 0) return null;
  const coverFile = data.post.files[0];
  const isLiked = data.post.isLiked;

  return (
    <div
      className={cn("relative group", "shadow-lg overflow-hidden")}
      onClick={onClick}
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

        {data.post.files.some((file) => file.type === "video") ? (
          <span className="absolute top-3 right-3">
            <Video className="size-5 fill-white" type="solid" />
          </span>
        ) : data.post.files.length > 1 ? (
          <span className="absolute top-3 right-3">
            <Clone className="size-5 fill-white" type="solid" />
          </span>
        ) : null}

        <HoverOverlay
          id={data.id}
          isLiked={isLiked}
          likes={data.post.likes}
          comments={data.post.comments}
        />
      </div>
    </div>
  );
}

type HoverOverlayProps = Readonly<{
  id: DetailedMomentInfo["id"];
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
          <span>{format.number(likes)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Message className="size-6 fill-white" type="solid" />
          <span>{format.number(comments)}</span>
        </div>
      </div>
    </Link>
  );
}
