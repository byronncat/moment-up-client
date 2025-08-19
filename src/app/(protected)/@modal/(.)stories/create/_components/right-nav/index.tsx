import { useAuth } from "@/components/providers";
import { useCreateData, useCanvas } from "../../_provider";
import { useState } from "react";

import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import Header from "./Header";
import ActionButtons from "./ActionButtons";
import FontSelector from "./FontSelector";
import BackgroundSelector from "./BackgroundSelector";
import { Settings } from "@/components/icons";

export default function RightNav() {
  const { type, uploadedMedia } = useCreateData();
  const { user } = useAuth();
  const { canvas } = useCanvas();
  const [activeToolTab, setActiveToolTab] = useState<
    "basic" | "text" | "media" | "draw"
  >("basic");

  function handleShare() {
    console.log("share");
  }

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
      <Header title="Stories" className="mt-7" />
      <div className="flex items-center gap-3 px-4 mt-5">
        <Avatar src={user?.avatar} alt={user?.username} size="14" />
        <span className="text-white text-lg font-semibold">
          {user?.username}
        </span>

        <button
          className={cn(
            "group ml-auto",
            "p-2 rounded-full",
            "bg-accent-dark/[.12] hover:bg-accent-dark/[.2]",
            "transition-colors duration-75",
            "cursor-pointer"
          )}
        >
          <Settings
            className={cn(
              "size-5 text-white/70 group-hover:text-white",
              "transition-colors duration-initial"
            )}
          />
        </button>
      </div>

      <div className="w-full h-px bg-border-dark mt-5" />

      {(type === "image" || type === "video") && (
        <>
          <div className="mt-4 px-4">
            <div className="flex gap-1 bg-muted-dark rounded-lg p-1">
              <button
                onClick={() => setActiveToolTab("basic")}
                className={cn(
                  "flex-1 py-2 px-3 text-sm rounded transition-colors",
                  activeToolTab === "basic"
                    ? "bg-accent-dark text-white"
                    : "text-muted-foreground-dark hover:text-white"
                )}
              >
                Basic
              </button>
              <button
                onClick={() => setActiveToolTab("text")}
                className={cn(
                  "flex-1 py-2 px-3 text-sm rounded transition-colors",
                  activeToolTab === "text"
                    ? "bg-accent-dark text-white"
                    : "text-muted-foreground-dark hover:text-white"
                )}
              >
                Text
              </button>
              <button
                onClick={() => setActiveToolTab("media")}
                className={cn(
                  "flex-1 py-2 px-3 text-sm rounded transition-colors",
                  activeToolTab === "media"
                    ? "bg-accent-dark text-white"
                    : "text-muted-foreground-dark hover:text-white"
                )}
              >
                Media
              </button>
              <button
                onClick={() => setActiveToolTab("draw")}
                className={cn(
                  "flex-1 py-2 px-3 text-sm rounded transition-colors",
                  activeToolTab === "draw"
                    ? "bg-accent-dark text-white"
                    : "text-muted-foreground-dark hover:text-white"
                )}
              >
                Draw
              </button>
            </div>
          </div>
        </>
      )}

      {type === "text" && (
        <>
          <div className="mt-6">
            <h3 className="px-4 text-muted-foreground-dark">Fonts</h3>
            <FontSelector />
          </div>

          <div className="mt-6 px-4">
            <h3 className="text-muted-foreground-dark">Backgrounds</h3>
            <BackgroundSelector
              className={cn("mt-2", "h-[calc(36px*3+8px*3+12px)]")}
            />
          </div>
        </>
      )}

      {(type === "image" || type === "video") && uploadedMedia && (
        <div className="mt-6">
          <h3 className="px-4 text-muted-foreground-dark">Media Info</h3>
          <div className="px-4 mt-3">
            <div className="text-sm text-card-foreground-dark">
              <div>
                <span className="font-semibold">Size</span>:{" "}
                {(uploadedMedia.file.size / (1024 * 1024)).toFixed(2)} MB
              </div>
              <div>
                <span className="font-semibold">Type</span>:{" "}
                {uploadedMedia.file.type}
              </div>
            </div>
          </div>
        </div>
      )}

      {type !== null && (
        <ActionButtons
          onShare={handleShare}
          canvasRef={{ current: canvas }}
          className="mt-auto"
        />
      )}
    </div>
  );
}
