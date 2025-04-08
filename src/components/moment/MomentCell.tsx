import type { MomentUI } from "api";

import Image from "next/image";
import { Heart, Comment, Clone } from "@/components/icons";
import { cn } from "@/lib/utils";

type MomentCellProps = Readonly<{
  data: MomentUI;
}>;

export default function MomentCell({ data }: MomentCellProps) {
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
        <Image
          src={data.files[0]}
          alt={data.caption || "Moment"}
          fill
          sizes="(min-width: 640px) 640px, 100vw"
          className="size-full object-cover object-top"
        />

        {data.files.length > 1 && (
          <span className="absolute top-3 right-3">
            <Clone className="size-5 fill-white" type="solid" />
          </span>
        )}

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
