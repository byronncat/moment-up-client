"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import { Modal } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Eye, Image, X } from "@/components/icons";

import { StoryBackground } from "@/constants/serverConfig";
import { TextBackground } from "@/constants/clientConfig";

export default function StoryModal() {
  const router = useRouter();
  function handleClose() {
    if (window.history.length > 1) router.back();
    else router.replace(ROUTE.HOME);
  }

  const [selectedBackground, setSelectedBackground] = useState<StoryBackground>(
    StoryBackground.BLUE_GRADIENT
  );
  const [type, setType] = useState<"text" | "image" | "video" | null>(null);

  function handleUploadMedia(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedMedia({ file, preview: result });
      };
      reader.readAsDataURL(file);
    }
  }

  const [uploadedMedia, setUploadedMedia] = useState<{
    file: File;
    preview: string;
  } | null>(null);

  return (
    <Modal className="flex">
      <div className="grow h-full bg-background-dark">
        {type === null ? (
          <ContentSection onSelectType={setType} onFileUpload={handleUploadMedia} />
        ) : (
          <Preview 
            selectedBackground={selectedBackground} 
            type={type} 
            uploadedMedia={uploadedMedia}
          />
        )}
      </div>
      <RightNav
        selectedBackground={selectedBackground}
        onSelectBackground={setSelectedBackground}
        type={type}
        uploadedMedia={uploadedMedia}
      />
      <Button
        onClick={handleClose}
        size="icon"
        variant="ghost"
        className={cn(
          "absolute top-2 left-2",
          "rounded-full",
          "hover:bg-accent-dark/[.2]",
          "text-muted-foreground-dark hover:text-accent-foreground-dark"
        )}
      >
        <X className="size-6" />
      </Button>
    </Modal>
  );
}

function ContentSection({
  onSelectType,
  onFileUpload,
}: Readonly<{ 
  onSelectType: (type: "text" | "image" | "video") => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleMediaClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(event);
      if (file.type.startsWith('image/')) {
        onSelectType("image");
      } else if (file.type.startsWith('video/')) {
        onSelectType("video");
      }
    }
  }
  return (
    <div className={cn("size-full", "flex items-center justify-center gap-5")}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div
        className={cn(
          "w-[220px] h-[330px]",
          "rounded-lg cursor-pointer",
          "flex flex-col items-center justify-center gap-2"
        )}
        style={TextBackground[StoryBackground.BLUE_GRADIENT]}
        onClick={handleMediaClick}
      >
        <div
          className={cn(
            "size-10 bg-background-dark rounded-full",
            "flex items-center justify-center"
          )}
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image multiple className="size-5" />
        </div>
        <div className="text-sm font-bold">Create a media story</div>
      </div>
      <div
        className={cn(
          "w-[220px] h-[330px]",
          "rounded-lg",
          "flex flex-col items-center justify-center gap-2"
        )}
        style={TextBackground[StoryBackground.PINK_PURPLE_BLUE_GRADIENT]}
        onClick={() => onSelectType("text")}
      >
        <div
          className={cn(
            "size-10 bg-background-dark rounded-full",
            "flex items-center justify-center"
          )}
        >
          Aa
        </div>
        <div className="text-sm font-bold">Create a text story</div>
      </div>
    </div>
  );
}

function Preview({
  selectedBackground,
  type,
  uploadedMedia,
}: Readonly<{
  selectedBackground: StoryBackground;
  type: "text" | "image" | "video";
  uploadedMedia: { file: File; preview: string } | null;
}>) {
  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const element = event.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }

  return (
    <div className={cn("size-full", "flex items-center justify-center")}>
      <div
        className={cn(
          "max-w-[80vh] w-full h-fit",
          "p-4 bg-card-dark rounded-lg"
        )}
      >
        <div className={cn("font-semibold", "mb-4", "flex items-center gap-2")}>
          <Eye isOpen className="size-4" />
          <span>Preview</span>
        </div>
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
              "size-full max-w-[calc(100%*9/16)] rounded-lg overflow-hidden",
              "flex items-center justify-center relative"
            )}
            style={type === "text" ? TextBackground[selectedBackground] : {}}
          >
            {type === "text" && (
              <textarea
                className={cn(
                  "px-5 h-auto w-full",
                  "text-white caret-white placeholder:text-white/[.7]",
                  "text-2xl font-semibold",
                  "focus:outline-none text-center",
                  "resize-none bg-transparent"
                )}
                placeholder="Start typing"
                onChange={handleInputChange}
              />
            )}
            {type === "image" && uploadedMedia && (
              <img
                src={uploadedMedia.preview}
                alt="Uploaded content"
                className="size-full object-cover"
              />
            )}
            {type === "video" && uploadedMedia && (
              <video
                src={uploadedMedia.preview}
                className="size-full object-cover"
                controls
                muted
                loop
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RightNav({
  selectedBackground,
  onSelectBackground,
  type,
  uploadedMedia,
}: Readonly<{
  selectedBackground: StoryBackground;
  onSelectBackground: (background: StoryBackground) => void;
  type: "text" | "image" | "video" | null;
  uploadedMedia: { file: File; preview: string } | null;
}>) {
  return (
    <div
      className={cn(
        "w-[360px] h-full",
        "box-content",
        "bg-card-dark text-card-foreground-dark",
        "border-l border-border-dark",
        "flex flex-col"
      )}
    >
      <div className="px-4 pt-7">
        <h2 className="text-2xl font-bold">Stories</h2>
      </div>

      {type === "text" && (
        <>
          <div className="pt-6">
            <h3 className="px-4 text-muted-foreground-dark">Fonts</h3>
            <div className="px-4 mt-3">Aa Clean</div>
          </div>

          <div className="pt-6">
            <h3 className="px-4 text-muted-foreground-dark">Backgrounds</h3>
            <div className={cn("grid grid-cols-7", "gap-4 px-4 mt-4")}>
              {TextBackground.map((background, index) =>
                selectedBackground === index ? (
                  <div
                    key={index}
                    className={cn(
                      "bg-white size-10",
                      "rounded-full flex items-center justify-center"
                    )}
                  >
                    <div
                      className={cn("size-9 rounded-full", "cursor-pointer")}
                      style={background}
                      onClick={() => onSelectBackground(index)}
                    />
                  </div>
                ) : (
                  <div
                    key={index}
                    className={cn("size-10 rounded-full", "cursor-pointer")}
                    style={background}
                    onClick={() => onSelectBackground(index)}
                  />
                )
              )}
            </div>
          </div>
        </>
      )}

      {(type === "image" || type === "video") && uploadedMedia && (
        <div className="pt-6">
          <h3 className="px-4 text-muted-foreground-dark">Media Info</h3>
          <div className="px-4 mt-3">
            <div className="text-sm text-card-foreground-dark">
              <div>File: {uploadedMedia.file.name}</div>
              <div>Size: {(uploadedMedia.file.size / (1024 * 1024)).toFixed(2)} MB</div>
              <div>Type: {uploadedMedia.file.type}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 px-4 pb-6 mt-auto">
        <button
          type="button"
          className={cn(
            "w-full h-10",
            "text-sm text-card-foreground-dark font-semibold",
            "bg-accent-dark/[.12] rounded-lg"
          )}
        >
          Discard
        </button>
        <button
          type="button"
          className={cn(
            "w-full h-10",
            "text-sm text-primary-foreground-dark font-semibold",
            "bg-primary-dark rounded-lg"
          )}
        >
          Share to story
        </button>
      </div>
    </div>
  );
}
