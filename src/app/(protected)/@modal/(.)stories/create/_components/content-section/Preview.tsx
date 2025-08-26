import { useCreateData } from "../../_providers";
import { cn } from "@/libraries/utils";
import { Eye } from "@/components/icons";
import { TextBackground } from "@/constants/clientConfig";
import FabricCanvas from "./FabricCanvas";
import { useEffect, useRef } from "react";

export default function Preview() {
  return (
    <div className={cn("size-full", "flex items-center justify-center")}>
      <div
        className={cn(
          "max-w-[80vh] w-full h-fit",
          "p-4 bg-card-dark rounded-lg"
        )}
      >
        <Header className="mb-4" />
        <PreviewContent />
      </div>
    </div>
  );
}

function Header({ className }: Readonly<{ className?: string }>) {
  return (
    <div
      className={cn(
        "text-white font-semibold",
        "flex items-center gap-2",
        className
      )}
    >
      <Eye isOpen className="size-4 " />
      <span>Preview</span>
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
    <div
      className={cn(
        "p-3",
        "max-w-[80vh] w-full aspect-square",
        "bg-muted-dark rounded-lg",
        "flex items-center justify-center"
      )}
    >
      <div
        className={cn(
          "size-full max-w-[calc(100%*9/16)]",
          "flex items-center justify-center relative"
        )}
      >
        <div
          className={cn("size-full", "rounded-lg overflow-hidden")}
          style={type === "text" ? TextBackground[selectedBackground] : {}}
        >
          {type === "text" && (
            <div className="size-full flex items-center justify-center">
              <textarea
                className={cn(
                  "px-5 h-auto w-full",
                  "text-white caret-white placeholder:text-white/[.7]",
                  "focus:outline-none text-center",
                  "resize-none bg-transparent",
                  font.className
                )}
                style={{ fontFamily: font.family }}
                placeholder="Start typing"
                value={textContent}
                onChange={handleInputChange}
              />
            </div>
          )}

          {type === "image" && uploadedMedia && (
            <FabricCanvas className="size-full bg-white" />
          )}

          {type === "video" && uploadedMedia && (
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
          )}
        </div>
      </div>
    </div>
  );
}
