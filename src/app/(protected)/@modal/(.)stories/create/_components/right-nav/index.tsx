import { useAuth } from "@/components/providers";
import { useCanvas, useCreateData } from "../../_providers";

import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "./Header";
import ActionButtons from "./ActionButtons";
import SoundSelector from "./sound-selector";
import FontSelector from "./FontSelector";
import BackgroundSelector from "./BackgroundSelector";
import MediaControls from "./MediaControls";
import { Folder, Settings } from "@/components/icons";
import { Save } from "lucide-react";

export default function RightNav() {
  const { type, uploadedMedia } = useCreateData();
  const { user } = useAuth();
  const { canvas } = useCanvas();

  function handleShare() {
    // console.log("share");
  }

  return (
    <ScrollArea
      className={cn(
        "w-[360px] h-full",
        "box-content",
        "bg-card-dark text-card-foreground-dark",
        "border-l border-border-dark"
      )}
    >
      <div className={cn("h-screen w-full", "flex flex-col")}>
        <Header title="Stories" className="mt-7" />
        <div className="flex items-center gap-3 px-4 mt-5">
          <Avatar
            src={user?.avatar}
            alt={user?.displayName ?? user?.username}
            size="14"
          />
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

        <Separator className="mt-4 bg-border-dark" />

        <div className="mt-4 space-y-5">
          {type === "image" && uploadedMedia ? (
            <div>
              <div className={cn("flex items-center gap-1.5", "px-4")}>
                <h3 className="text-muted-foreground-dark">File controls</h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs text-muted-foreground-dark",
                    "border-accent-dark/12"
                  )}
                >
                  <Save className="size-3 mr-0.5" />
                  {(uploadedMedia.file.size / (1024 * 1024)).toFixed(2)} MB
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs text-muted-foreground-dark",
                    "border-accent-dark/12"
                  )}
                >
                  <Folder className="size-4 mr-0.5" />
                  {uploadedMedia?.file.type.split("/")[1]}
                </Badge>
              </div>

              <MediaControls className="px-4 mt-5" />
            </div>
          ) : null}

          {type === "text" && (
            <>
              <div className="px-4">
                <h3 className="text-muted-foreground-dark">Fonts</h3>
                <FontSelector className="mt-2" />
              </div>

              <div className="px-4">
                <h3 className="text-muted-foreground-dark">Backgrounds</h3>
                <BackgroundSelector
                  className={cn("mt-2", "h-[calc(36px*3+8px*3+12px)]")}
                />
              </div>
            </>
          )}

          {type !== null && (
            <div className="px-4">
              <div
                className={cn(
                  "flex items-baseline gap-1",
                  "text-muted-foreground-dark"
                )}
              >
                <h3>Sound</h3>
                <span className="text-sm">(optional)</span>
              </div>
              <SoundSelector className="mt-2" />
            </div>
          )}
        </div>

        {type !== null && (
          // mt-auto need parent to be flex-col
          <div className={cn("grow mt-12", "flex flex-col")}>
            <ActionButtons
              onShare={handleShare}
              canvasRef={{ current: canvas as HTMLCanvasElement | null }}
              className="mt-auto"
            />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
