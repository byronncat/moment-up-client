"use client";

import type { DetailedMoment } from "api";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CoreApi } from "@/services";

import { Modal } from "@/components";
import { CardContent } from "@/components/ui/card";
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
    router.back();
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
    <div
      className={cn(
        "size-full bg-background",
        "flex justify-center items-center"
      )}
    >
      {children}
    </div>
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
      <CardContent className="p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {data.map((file, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-square">
                  {file.type === "image" ? (
                    <Image
                      src={file.url}
                      alt={`Moment ${index + 1}`}
                      fill
                      sizes="574px"
                      className="object-cover"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
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
                          <Play
                            className="size-12 fill-white/80"
                            type="solid"
                          />
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
      </CardContent>
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
