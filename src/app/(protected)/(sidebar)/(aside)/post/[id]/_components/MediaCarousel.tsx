import type { PostDto } from "api";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/libraries/utils";
import Image from "next/image";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Chevron, Play } from "@/components/icons";
import { BLUR_DATA_URL, VIDEO_SKIP_DURATION } from "@/constants/client";

type MediaCarouselProps = Readonly<{
  files: PostDto["files"];
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

  function handleSkip(direction: "next" | "prev") {
    const currentIndex = api?.selectedScrollSnap();
    if (currentIndex === undefined) return;

    const videoEl = videoRefs.current[currentIndex];
    if (videoEl) {
      videoEl.currentTime +=
        VIDEO_SKIP_DURATION * (direction === "next" ? 1 : -1);
    }
  }

  function handlePlay() {
    const currentIndex = api?.selectedScrollSnap();
    if (currentIndex === undefined) return;

    const videoEl = videoRefs.current[currentIndex];
    if (videoEl) {
      if (videoEl.paused) videoEl.play();
      else videoEl.pause();
    }
  }

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
        watchDrag: false,
      }}
    >
      <CarouselContent>
        {files.map((file, index) => (
          <CarouselItem key={file.id}>
            {file.type === "image" ? (
              <div className="relative w-full aspect-square bg-muted">
                <Image
                  src={file.id}
                  alt={`Post ${index + 1}`}
                  fill
                  sizes="80vw"
                  className="object-contain select-none"
                  priority={index === initialIndex}
                  loading={index === initialIndex ? "eager" : "lazy"}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
            ) : (
              <div className="relative w-full aspect-square">
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={file.id}
                  className="size-full object-contain"
                  controls
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <div
                  className={cn(
                    "absolute inset-0",
                    "flex items-center justify-center gap-8",
                    "pointer-events-none"
                  )}
                >
                  <SkipButtons handleSkip={handleSkip}>
                    <button
                      onClick={handlePlay}
                      className={cn(
                        "cursor-pointer pointer-events-auto",
                        isPlaying && "opacity-0"
                      )}
                    >
                      <Play className="size-10 fill-white/80" />
                    </button>
                  </SkipButtons>
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

type SkipButtonsProps = Readonly<{
  handleSkip: (direction: "next" | "prev") => void;
  children: React.ReactNode;
}>;

export function SkipButtons({ handleSkip, children }: SkipButtonsProps) {
  return (
    <>
      <button
        className={cn(
          "size-12 flex items-center justify-center",
          "cursor-pointer pointer-events-auto",
          "opacity-0 hover:opacity-100",
          "transition-opacity duration-150 ease-in-out"
        )}
        onClick={() => handleSkip("prev")}
      >
        <Chevron direction="left" multiple className="size-8 text-white/70" />
      </button>
      {children}
      <button
        className={cn(
          "size-12 flex items-center justify-center",
          "cursor-pointer pointer-events-auto",
          "opacity-0 hover:opacity-100",
          "transition-opacity duration-150 ease-in-out"
        )}
        onClick={() => handleSkip("next")}
      >
        <Chevron direction="right" multiple className="size-8 text-white/70" />
      </button>
    </>
  );
}
