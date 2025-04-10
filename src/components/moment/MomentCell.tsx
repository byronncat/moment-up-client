import type { MomentUI } from "api";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heart, Comment, Clone, Video } from "@/components/icons";

type MomentCellProps = Readonly<{
  data: MomentUI;
}>;

export default function MomentCell({ data }: MomentCellProps) {
  if (!data.files || data.files.length === 0) return null;

  const randomFile = data.files[Math.floor(Math.random() * data.files.length)];

  return (
    <div key={data.id} className="relative group shadow-lg">
      <div
        className={cn(
          "aspect-square overflow-hidden",
          "bg-card",
          "hover:cursor-pointer",
          "relative"
        )}
      >
        {randomFile.type === "image" ? (
          <Image
            src={randomFile.url}
            alt={data.text || "Moment"}
            fill
            sizes="(min-width: 640px) 640px, 100vw"
            className="size-full object-cover object-top"
          />
        ) : (
          <video
            src={randomFile.url}
            className="size-full object-cover"
            playsInline
            preload="metadata"
          />
        )}

        {data.files.some(file => file.type === "video") ? (
          <span className="absolute top-3 right-3">
            <Video className="size-5 fill-white" type="solid" />
          </span>
        ) : data.files.length > 1 ? (
          <span className="absolute top-3 right-3">
            <Clone className="size-5 fill-white" type="solid" />
          </span>
        ) : null}

        <HoverOverlay likes={data.likes} comments={data.comments} />
      </div>
    </div>
  );
}

type HoverOverlayProps = Readonly<{
  likes: number;
  comments: number;
}>;

function HoverOverlay({ likes, comments }: HoverOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-black/50",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        "flex items-center justify-center"
      )}
    >
      <div className="flex gap-6 text-white font-semibold">
        <div className="flex items-center gap-2">
          <Heart className="size-6 fill-red-500" type="solid" />
          <span>{likes}</span>
        </div>
        <div className="flex items-center gap-2">
          <Comment className="size-6 fill-white" type="solid" />
          <span>{comments}</span>
        </div>
      </div>
    </div>
  );
}
