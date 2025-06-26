import type { File } from "schema";

import { useRef, useState, useEffect } from "react";

import { cn } from "@/libraries/utils";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Pause, Play } from "@/components/icons";

type MediaCarouselProps = Readonly<{
  files: File[] | undefined;
  initialIndex?: number;
  className?: string;
}>;

export default function MediaCarousel({
  files,
  initialIndex = 0,
  className,
}: MediaCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const currentIndex = api.selectedScrollSnap();
      const newUrl = `${window.location.pathname}?imgIndex=${currentIndex}`;
      window.history.replaceState(null, "", newUrl);

      Object.values(videoRefs.current).forEach((videoEl) => {
        if (videoEl && !videoEl.paused) videoEl.pause();
      });
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!files) return null;
  return (
    <Carousel
      className={cn("aspect-square w-full", className)}
      setApi={setApi}
      opts={{
        startIndex: initialIndex,
        duration: 0,
      }}
    >
      <CarouselContent>
        {files.map((file, index) => (
          <CarouselItem key={index}>
            {file.type === "image" ? (
              <div className="relative w-full aspect-square bg-muted">
                <Image
                  src={file.url}
                  alt={`Moment ${index + 1}`}
                  fill
                  sizes="80vw"
                  className="object-contain select-none"
                  priority={index === initialIndex}
                  loading={index === initialIndex ? "eager" : "lazy"}
                />
              </div>
            ) : (
              <div
                className={cn(
                  "relative h-[50vh] md:h-screen w-full",
                  "cursor-pointer"
                )}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={file.url}
                  className="size-full object-contain"
                  controls
                  playsInline
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
                    <Play className="size-12 fill-white/80" />
                  )}
                </div>
              </div>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      {files.length > 1 && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      )}
    </Carousel>
  );
}
