"use client";

import type { FileInfo } from "api";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/libraries/utils";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SkipButtons } from "@/app/(protected)/(sidebar)/(aside)/post/[id]/_components/MediaCarousel";
import { Play } from "@/components/icons";
import { BLUR_DATA_URL, VIDEO_SKIP_DURATION } from "@/constants/client";

type MediaCarouselProps = Readonly<{
  files: FileInfo[];
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

  useEffect(() => {
    if (api && files && initialIndex > 0 && initialIndex < files.length) {
      api.scrollTo(initialIndex);
    }
  }, [api, initialIndex, files]);

  return (
    <Wrapper className={className}>
      <CardContent className="p-0 size-full">
        <Carousel
          className="size-full"
          setApi={setApi}
          opts={{
            startIndex: initialIndex,
            duration: 0,
          }}
        >
          <CarouselContent>
            {files.map((file, index) => (
              <CarouselItem key={file.id}>
                {file.type === "image" ? (
                  <div className="relative h-[50vh] md:h-screen w-full">
                    <Image
                      src={file.id}
                      alt={`Moment ${index + 1}`}
                      className="object-contain select-none"
                      fill
                      sizes="90vw"
                      quality={100}
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                ) : (
                  <div className="relative h-[50vh] md:h-screen w-full">
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
          {files.length && files.length > 1 ? (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          ) : null}
        </Carousel>
      </CardContent>
    </Wrapper>
  );
}

function Wrapper({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <div
      className={cn(
        "size-full bg-background",
        "max-h-[50vh] md:max-h-none",
        className
      )}
    >
      {children}
    </div>
  );
}
