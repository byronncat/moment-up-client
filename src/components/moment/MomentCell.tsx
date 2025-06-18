import type { DetailedMomentInfo } from "api";

import Image from "next/image";
import { cn } from "@/libraries/utils";
import { Heart, Comment, Clone, Video } from "@/components/icons";

type MomentCellProps = Readonly<{
  data: DetailedMomentInfo;
}>;

export default function MomentCell({ data }: MomentCellProps) {
  if (!data.post.files || data.post.files.length === 0) return null;
  const coverFile = data.post.files[0];

  return (
    <div
      key={data.id}
      className={cn("relative group", "rounded-lg shadow-lg overflow-hidden")}
    >
      <div
        className={cn(
          "aspect-square overflow-hidden",
          "bg-card",
          "hover:cursor-pointer",
          "relative"
        )}
      >
        {coverFile.type === "image" ? (
          <Image
            src={coverFile.url}
            alt={data.post.text || "Moment image"}
            fill
            sizes="33vw"
            className="size-full object-cover object-top"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPDY2ODYyTEhMR0BGRlNCRkJHYGFjYWM4OTtBV0ZGUJJgdmBwoKD/2wBDARUXFx4aHh0eHCAdHyChOKE4oaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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

        <HoverOverlay likes={data.post.likes} comments={data.post.comments} />
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
