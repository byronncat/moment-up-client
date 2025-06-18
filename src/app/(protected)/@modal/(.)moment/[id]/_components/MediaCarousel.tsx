"use client";

import type { File } from "schema";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ROUTE } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Pause, Play } from "lucide-react";

export default function MediaCarousel({
  files,
  initialIndex = 0,
}: Readonly<{ files?: File[]; initialIndex?: number }>) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const router = useRouter();
  const params = useParams();
  const momentId = params.id as string;

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const currentIndex = api.selectedScrollSnap();

      const newUrl = ROUTE.MOMENT(momentId, currentIndex);
      router.replace(newUrl, {
        scroll: false,
      });

      Object.values(videoRefs.current).forEach((videoEl) => {
        if (videoEl && !videoEl.paused) videoEl.pause();
      });
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, momentId, router]);

  useEffect(() => {
    if (api && files && initialIndex > 0 && initialIndex < files.length) {
      api.scrollTo(initialIndex);
    }
  }, [api, initialIndex, files]);

  if (!files)
    return (
      <Wrapper>
        <Skeleton className="size-full rounded-none" />
      </Wrapper>
    );
  return (
    <Wrapper>
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
                  <div className="relative h-screen w-full">
                    <Image
                      src={file.url}
                      alt={`Moment ${index + 1}`}
                      fill
                      sizes="80vw"
                      className="object-contain"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ) : (
                  <div
                    className={cn("relative h-screen w-full", "cursor-pointer")}
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
                        <Play className="size-12 fill-white/80" type="solid" />
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

function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={cn("size-full bg-background")}>{children}</div>;
}
