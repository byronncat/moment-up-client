"use client";

import type { FileInfo } from "api";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/libraries/utils";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Pause, Play } from "@/components/icons";
import { BLUR_DATA_URL } from "@/constants/clientConfig";

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
              <CarouselItem key={index}>
                {file.type === "image" ? (
                  <div className="relative h-[50vh] md:h-screen w-full">
                    <Image
                      src={file.url}
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
          {files.length && files.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
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
