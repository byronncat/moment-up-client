"use client";

import type { DetailedMoment } from "api";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CoreApi } from "@/services";

import { Modal } from "@/components";
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pause, Play, X } from "lucide-react";

export default function MomentModal() {
  const router = useRouter();
  const params = useParams();
  const momentId = params.id as string;
  const [moment, setMoment] = useState<DetailedMoment | null>(null);
  const [mediaLoading, setMediaLoading] = useState(true);

  function closeHandler() {
    // Check if there's a previous page in the same host
    const referrer = document.referrer;
    const currentHost = window.location.host;

    // If referrer exists and is from the same host, go back
    if (referrer && new URL(referrer).host === currentHost) {
      router.back();
    } else {
      // Otherwise navigate to homepage
      router.push("/");
    }
  }

  useEffect(() => {
    async function fetchMoment() {
      const res = await CoreApi.getMoment(momentId);
      if (res.success) setMoment(res.data ?? null);
      setMediaLoading(false);
    }
    fetchMoment();
  }, [momentId]);

  return (
    <Modal>
      <MediaFiles data={moment?.post.files} loading={mediaLoading} />
      <Content onClose={closeHandler} />
    </Modal>
  );
}

type MediaFilesProps = ComponentProps<{
  data: DetailedMoment["post"]["files"];
  loading: boolean;
}>;

function MediaFiles({ data, loading }: MediaFilesProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const Wrapper = ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <div className={cn("grow", "h-full bg-background")}>{children}</div>
  );

  if (loading)
    return (
      <Wrapper>
        <Skeleton className="size-full" />
      </Wrapper>
    );
  if (!data)
    return (
      <Wrapper>
        <Skeleton className="size-full" />
      </Wrapper>
    );
  return (
    <Wrapper>
      <Carousel className="w-full h-screen">
        <CarouselContent className="h-full">
          {data.map((file, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative w-full h-full">
                {file.type === "image" ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={file.url}
                      alt={`Moment ${index + 1}`}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
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
            </CarouselItem>
          ))}
        </CarouselContent>
        {data.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
    </Wrapper>
  );
}

type ContentProps = ComponentProps<{
  onClose: () => void;
}>;

function Content({ onClose }: ContentProps) {
  return (
    <div
      className={cn(
        "relative",
        "flex flex-col",
        "w-[22.5rem] h-full shrink-0 bg-card"
      )}
    >
      <div className="absolute top-0 right-0 p-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>
    </div>
  );
}
