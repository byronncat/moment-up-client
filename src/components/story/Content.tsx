import { __parseUrl } from "@/__mocks__";
import type { StoryInfo } from "api";

import { useEffect, useRef, useState } from "react";
import { BLUR_DATA_URL, TextBackground } from "@/constants/client";
import { DEFAULT_DURATION } from "./hooks/useContentProgress";

import { cn } from "@/libraries/utils";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FontFamilies } from "@/app/(protected)/@modal/(.)stories/create/_constants";

type ContentProps = Readonly<{
  content: StoryInfo["stories"][number]["content"];
  shouldPlay?: boolean;
  setVideoRef?: (video: HTMLVideoElement | null) => void;
  onLoadingComplete: () => void;
}>;

export default function Content({
  content,
  shouldPlay,
  setVideoRef,
  onLoadingComplete,
}: ContentProps) {
  return (
    <AspectRatio ratio={9 / 16}>
      {content.type === "text" ? (
        <TextContent
          content={content}
          shouldPlay={shouldPlay}
          onLoadingComplete={onLoadingComplete}
        />
      ) : content.type === "image" ? (
        <div
          className={cn(
            "size-full relative",
            "mobile:rounded-lg overflow-hidden"
          )}
        >
          <Image
            src={__parseUrl(content.id, "image") as string}
            alt={`Story ${content.id}`}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            quality={100}
            loading="eager"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            onLoad={onLoadingComplete}
          />
        </div>
      ) : (
        <video
          className="size-full object-contain bg-black"
          autoPlay
          ref={(element) => {
            setVideoRef?.(element);
          }}
          onLoadedData={onLoadingComplete}
        >
          <source
            src={__parseUrl(content.id, "video") as string}
            type="video/mp4"
          />
        </video>
      )}
    </AspectRatio>
  );
}

type TextContentProps = Readonly<{
  content: Extract<StoryInfo["stories"][number]["content"], { type: "text" }>;
  shouldPlay?: boolean;
  onLoadingComplete: () => void;
}>;

function TextContent({
  content,
  shouldPlay,
  onLoadingComplete,
}: TextContentProps) {
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const progressRef = useRef<number>(0);
  const lastTimestampRef = useRef<number | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!textContainerRef.current) return;

    const container = textContainerRef.current;
    const overflowing = container.scrollHeight > container.clientHeight;
    setIsOverflowing(overflowing);
  }, [content]);

  useEffect(() => {
    progressRef.current = 0;
    lastTimestampRef.current = null;
    if (textContainerRef.current) textContainerRef.current.scrollTop = 0;
  }, [content]);

  useEffect(() => {
    if (!textContainerRef.current || !isOverflowing) return;

    const container = textContainerRef.current;
    const scrollDistance = container.scrollHeight - container.clientHeight;

    const animateScroll = (timestamp: number) => {
      if (!shouldPlay) {
        lastTimestampRef.current = null;
        animationFrameIdRef.current = null;
        return;
      }

      if (lastTimestampRef.current !== null) {
        const delta = timestamp - lastTimestampRef.current;
        const progressIncrement = delta / DEFAULT_DURATION;
        progressRef.current = Math.min(
          progressRef.current + progressIncrement,
          1
        );
      }
      lastTimestampRef.current = timestamp;

      // Ease-in-out
      const easeProgress =
        progressRef.current < 0.5
          ? 2 * progressRef.current * progressRef.current
          : 1 - Math.pow(-2 * progressRef.current + 2, 2) / 2;

      container.scrollTop = scrollDistance * easeProgress;

      if (progressRef.current < 1)
        animationFrameIdRef.current = requestAnimationFrame(animateScroll);
      else animationFrameIdRef.current = null;
    };

    if (shouldPlay) {
      lastTimestampRef.current = null;
      animationFrameIdRef.current = requestAnimationFrame(animateScroll);
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [shouldPlay, isOverflowing]);

  const fontFamily = FontFamilies[content.font];
  return (
    <div className="size-full relative">
      <div
        ref={(el) => {
          textContainerRef.current = el;
          if (el) onLoadingComplete();
        }}
        className={cn(
          "size-full p-5 overflow-y-auto",
          "flex justify-center",
          "text-center text-shadow-lg/20",
          !isOverflowing && "items-center",
          fontFamily.className,
          "scrollbar-hide"
        )}
        style={{
          ...TextBackground[content.background],
          fontFamily: fontFamily.family,
          whiteSpace: "pre-line",
        }}
      >
        {content.text}
      </div>
    </div>
  );
}
