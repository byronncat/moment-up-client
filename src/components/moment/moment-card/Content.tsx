"use client";

import type { DetailedMoment } from "api";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/clientConfig";
import { useData } from "./provider/Data";

import Image from "next/image";
import Link from "next/link";
import { CardContent } from "../../ui/card";
import { Play, Pause } from "../../icons";

export default function Content() {
  const { postData: post, momentId } = useData();
  const [isPlaying, setIsPlaying] = useState(false);

  const TextContent = () => {
    const textRef = useRef<HTMLParagraphElement>(null);
    const [isTextClamped, setIsTextClamped] = useState(false);

    useEffect(() => {
      const checkClamping = () => {
        const element = textRef.current;
        if (element)
          setIsTextClamped(element.scrollHeight > element.clientHeight);
      };

      checkClamping();
      window.addEventListener("resize", checkClamping);
      return () => window.removeEventListener("resize", checkClamping);
    }, []);

    if (!post.text) return null;

    return (
      <CardContent className="px-3 pb-2">
        <div
          className={cn(
            "flex",
            post.files?.length
              ? "flex-row items-center"
              : "flex-col items-start gap-1"
          )}
        >
          <p
            ref={textRef}
            className={cn(
              "wrap-break-word",
              post.files?.length ? "line-clamp-1" : "line-clamp-2"
            )}
          >
            {post.text}
          </p>
          <button
            className={cn(
              "font-semibold text-sm text-muted-foreground",
              "cursor-pointer hover:underline",
              "shrink-0",
              "opacity-0",
              isTextClamped && "!opacity-100"
            )}
          >
            Show details
          </button>
        </div>
      </CardContent>
    );
  };

  const MediaContent = function MediaContent() {
    if (!post.files) return null;

    const calculateAspectRatio = (ratioString: string): number => {
      const [width, height] = ratioString.split(":").map(Number);
      return width / height;
    };

    const isHorizontal = (ratio: string): boolean => {
      const aspectRatio = calculateAspectRatio(ratio);
      return aspectRatio > 1;
    };

    const getAspectRatioClass = (ratio: string) => {
      switch (ratio) {
        case "1:1":
          return "aspect-square";
        case "9:16":
          return "aspect-[9/16]";
        case "4:5":
          return "aspect-[4/5]";
        case "1.91:1":
          return "aspect-[1.91/1]";
        default:
          return "aspect-square";
      }
    };

    type FileType = NonNullable<DetailedMoment["post"]["files"]>[0];

    const renderMediaItem = (
      file: FileType,
      index: number,
      className?: string
    ) => (
      <Link key={index} href={ROUTE.MOMENT(momentId)} className={className}>
        <div className="relative size-full">
          {file.type === "image" ? (
            <Image
              src={file.url}
              alt={`Moment ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 574px"
              className="object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              priority={index === 0}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPDY2ODYyTEhMR0BGRlNCRkJHYGFjYWM4OTtBV0ZGUJJgdmBwoKD/2wBDARUXFx4aHh0eHCAdHyChOKE4oaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          ) : (
            <div className={cn("relative size-full", "cursor-pointer")}>
              <video
                src={file.url}
                className="size-full object-cover"
                controls
                playsInline
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <div
                className={cn(
                  "absolute inset-0",
                  "flex items-center justify-center",
                  "pointer-events-none"
                )}
              >
                {isPlaying ? (
                  <Pause className="size-12 fill-white/80" />
                ) : (
                  <Play className="size-12 fill-white/80" type="solid" />
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    );

    const renderSingleImage = () => {
      const files = post.files!;
      const file = files[0];
      return (
        <div className={cn("relative", getAspectRatioClass(file.aspect_ratio))}>
          {renderMediaItem(file, 0)}
        </div>
      );
    };

    const render2Images = () => {
      const files = post.files!;
      const firstImageHorizontal = isHorizontal(files[0].aspect_ratio);

      if (firstImageHorizontal) {
        return (
          <div className="grid grid-rows-2 gap-1 aspect-square">
            <div className="relative">{renderMediaItem(files[0], 0)}</div>
            <div className="relative">{renderMediaItem(files[1], 1)}</div>
          </div>
        );
      } else {
        return (
          <div className="grid grid-cols-2 gap-1 aspect-square">
            <div className="relative">{renderMediaItem(files[0], 0)}</div>
            <div className="relative">{renderMediaItem(files[1], 1)}</div>
          </div>
        );
      }
    };

    const render3Images = () => {
      const files = post.files!;
      const firstImageHorizontal = isHorizontal(files[0].aspect_ratio);

      if (firstImageHorizontal) {
        return (
          <div className="grid grid-rows-2 gap-1 aspect-square">
            <div className="relative">{renderMediaItem(files[0], 0)}</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="relative aspect-square">
                {renderMediaItem(files[1], 1)}
              </div>
              <div className="relative aspect-square">
                {renderMediaItem(files[2], 2)}
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="grid grid-cols-2 gap-1 aspect-square">
            <div className="relative">{renderMediaItem(files[0], 0)}</div>
            <div className="grid grid-rows-2 gap-1">
              <div className="relative aspect-square">
                {renderMediaItem(files[1], 1)}
              </div>
              <div className="relative aspect-square">
                {renderMediaItem(files[2], 2)}
              </div>
            </div>
          </div>
        );
      }
    };

    const render4Images = () => {
      const files = post.files!;
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 aspect-square">
          {files.map((file, index) => (
            <div key={index} className="relative aspect-square">
              {renderMediaItem(file, index)}
            </div>
          ))}
        </div>
      );
    };

    const render5PlusImages = () => {
      const files = post.files!;
      const firstImageHorizontal = isHorizontal(files[0].aspect_ratio);

      if (firstImageHorizontal) {
        return (
          <div className="grid grid-rows-2 gap-1 aspect-square">
            <div className="grid grid-cols-2 gap-1">
              <div className="relative">{renderMediaItem(files[0], 0)}</div>
              <div className="relative">{renderMediaItem(files[1], 1)}</div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {files.slice(2, 5).map((file, index) => (
                <div key={index + 2} className="relative aspect-square">
                  {renderMediaItem(file, index + 2)}
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
          </div>
        );
      } else {
        return (
          <div className="grid grid-cols-2 gap-1 aspect-square">
            <div className="grid grid-rows-2 gap-1">
              <div className="relative aspect-square">
                {renderMediaItem(files[0], 0)}
              </div>
              <div className="relative aspect-square">
                {renderMediaItem(files[1], 1)}
              </div>
            </div>
            <div className="grid grid-rows-3 gap-1">
              {files.slice(2, 5).map((file, index) => (
                <div key={index + 2} className="relative">
                  {renderMediaItem(file, index + 2)}
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
          </div>
        );
      }
    };

    const renderImageGrid = () => {
      const files = post.files!;
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

    return <CardContent className="p-0">{renderImageGrid()}</CardContent>;
  };

  return (
    <div>
      <TextContent />
      <MediaContent />
    </div>
  );
}
