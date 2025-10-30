import { __parseUrl } from "@/__mocks__";
import type { StoryInfo } from "api";

import { cn } from "@/libraries/utils";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BLUR_DATA_URL, TextBackground } from "@/constants/client";

type ContentProps = Readonly<{
  content: StoryInfo["stories"][number]["content"];
  setVideoRef?: (video: HTMLVideoElement | null) => void;
}>;

export default function Content({ content, setVideoRef }: ContentProps) {
  return (
    <AspectRatio ratio={9 / 16}>
      {content.type === "text" ? (
        <div
          className={cn(
            "size-full p-5",
            "flex items-center justify-center",
            "text-center font-semibold text-2xl"
          )}
          style={TextBackground[content.background]}
        >
          {content.text}
        </div>
      ) : content.type === "image" ? (
        <div className="size-full bg-white">
          <Image
            src={__parseUrl(content.id, "image") as string}
            alt={`Story ${content.id}`}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            quality={100}
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>
      ) : (
        <video
          className="size-full object-contain bg-black"
          autoPlay
          ref={(ref) => {
            setVideoRef?.(ref);
          }}
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
