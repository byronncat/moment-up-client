import { useRef } from "react";
import { cn } from "@/libraries/utils";
import { Image as ImageIcon } from "@/components/icons";

import { StoryBackground } from "@/constants/serverConfig";
import { TextBackground } from "@/constants/clientConfig";
import { useCreateData } from "../../_provider";

export default function TypeSelector() {
  const { setType, handleUploadMedia } = useCreateData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleMediaClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      handleUploadMedia(event);
      if (file.type.startsWith("image/")) setType("image");
      else if (file.type.startsWith("video/")) setType("video");
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
      <SelectionCard
        background={StoryBackground.BLUE_GRADIENT}
        icon={<ImageIcon className="size-5 text-white" />}
        title="Create a media story"
        onClick={handleMediaClick}
      />
      <SelectionCard
        background={StoryBackground.PINK_PURPLE_BLUE_GRADIENT}
        icon={
          <div
            className={cn(
              "text-white",
              "size-10 bg-background-dark rounded-full",
              "flex items-center justify-center"
            )}
          >
            Aa
          </div>
        }
        title="Create a text story"
        onClick={() => setType("text")}
      />
    </div>
  );
}

type SelectionCardProps = {
  background: StoryBackground;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
};

function SelectionCard({
  background,
  icon,
  title,
  onClick,
}: SelectionCardProps) {
  return (
    <div
      className={cn(
        "w-[220px] h-[330px]",
        "rounded-lg cursor-pointer",
        "flex flex-col items-center justify-center gap-2"
      )}
      style={TextBackground[background]}
      onClick={onClick}
    >
      <div
        className={cn(
          "size-10 bg-background-dark rounded-full",
          "flex items-center justify-center"
        )}
      >
        {icon}
      </div>
      <div className="text-sm font-bold text-white">{title}</div>
    </div>
  );
}
