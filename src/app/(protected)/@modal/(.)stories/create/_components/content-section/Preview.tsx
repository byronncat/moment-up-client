import { useEffect, useRef } from "react";
import { useCreateData } from "../../_providers";

import { cn } from "@/libraries/utils";
import { Eye } from "@/components/icons";
import { TextBackground } from "@/constants/client";
import FabricCanvas from "./FabricCanvas";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Preview() {
  return (
    <div className={cn("size-full", "flex items-center justify-center")}>
      <div
        className={cn(
          "p-4 bg-card-dark rounded-lg",
          "max-h-[90svh] max-w-[90svh] size-full mx-2",
          "flex flex-col"
        )}
      >
        <div
          className={cn(
            "text-white text-sm font-semibold",
            "flex items-center gap-2",
            "mb-3"
          )}
        >
          <Eye isOpen className="size-4 " />
          Preview
        </div>

        <PreviewContent />
      </div>
    </div>
  );
}

function PreviewContent() {
  const {
    type,
    textContent,
    font,
    selectedBackground,
    uploadedMedia,
    uploadedAudio,
    setTextContent,
  } = useCreateData();
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const element = event.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
    setTextContent(element.value);
  }

  useEffect(() => {
    if (videoRef.current) videoRef.current.currentTime = 0;
  }, [uploadedAudio?.trimStart, uploadedAudio?.trimEnd]);

  return (
    <div className={cn("bg-muted-dark rounded-lg", "grow overflow-x-auto p-3")}>
      <div className="h-full">
        <div
          className={cn("rounded-lg mx-auto", "aspect-9/16 h-full shrink-0")}
          style={{
            ...(type === "text" ? TextBackground[selectedBackground] : {}),
          }}
        >
          {type === "text" && (
            <ScrollArea
              className="size-full"
              viewportClassName="[&>div]:min-h-full [&>div]:!flex [&>div]:items-center [&>div]:justify-center"
            >
              <textarea
                className={cn(
                  "px-5 py-3 size-full m-auto",
                  "flex items-center justify-center",
                  "text-white caret-white placeholder:text-white/70",
                  "focus:outline-none text-center",
                  "resize-none",
                  font.className
                )}
                style={{ fontFamily: font.family }}
                placeholder="Start typing"
                value={textContent}
                onChange={handleInputChange}
              />
            </ScrollArea>
          )}

          {type === "image" && uploadedMedia ? (
            <FabricCanvas className="size-full bg-white" />
          ) : null}

          {type === "video" && uploadedMedia ? (
            <video
              src={uploadedMedia.preview}
              className="size-full object-contain bg-black"
              muted={!!uploadedAudio}
              autoPlay
              loop
              ref={(ref) => {
                if (ref) videoRef.current = ref;
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
