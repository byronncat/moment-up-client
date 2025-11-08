import { __parseUrl } from "@/__mocks__";
import type { StoryInfo } from "api";

import { cn } from "@/libraries/utils";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BLUR_DATA_URL, TextBackground } from "@/constants/client";
import { FontFamilies } from "@/app/(protected)/@modal/(.)stories/create/_constants";

type ContentProps = Readonly<{
  content: StoryInfo["stories"][number]["content"];
  shouldPlay?: boolean;
  setVideoRef?: (video: HTMLVideoElement | null) => void;
  onLoadingComplete: () => void;
}>;

export default function Content({
  content,
  setVideoRef,
  onLoadingComplete,
}: ContentProps) {
  return (
    <AspectRatio ratio={9 / 16}>
      {content.type === "text" ? (
        (() => {
          const fontFamily = FontFamilies[content.font];

          return (
            <div
              className={cn(
                "size-full p-5",
                "flex items-center justify-center",
                "text-center",
                fontFamily.className
              )}
              style={{
                ...TextBackground[content.background],
                fontFamily: fontFamily.family,
              }}
              ref={() => onLoadingComplete()}
            >
              {content.text}
            </div>
          );
        })()
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
