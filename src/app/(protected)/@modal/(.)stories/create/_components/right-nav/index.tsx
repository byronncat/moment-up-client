import { useAuth } from "@/components/providers";
import { useCreateData } from "../../_providers";

import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActionButtons from "./ActionButtons";
import SoundSelector from "./sound-selector";
import FontSelector from "./FontSelector";
import BackgroundSelector from "./BackgroundSelector";
import MediaControls from "./MediaControls";
import PrivacyDialog from "./PrivacyDialog";
import { Folder } from "@/components/icons";
import { Save } from "lucide-react";

export default function RightNav({
  className,
}: Readonly<{ className?: string }>) {
  const { user } = useAuth();
  const { type, uploadedMedia } = useCreateData();

  return (
    <ScrollArea
      className={cn(
        "box-content",
        "bg-background-dark md:bg-card-dark text-card-foreground-dark",
        "border-t md:border-l border-border-dark",
        className
      )}
    >
      <div className={cn("md:h-lvh w-full", "flex flex-col")}>
        <div className="px-4 mt-7 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            <span className="hidden md:inline">Stories</span>
            <span className="inline md:hidden">Settings</span>
          </h2>

          <PrivacyDialog disablePortal className="ml-auto md:hidden" />
        </div>

        <div className="flex items-center gap-3 px-4 mt-5">
          <Avatar
            src={user?.avatar}
            alt={`${user?.displayName ?? user?.username}'s avatar`}
            size="12"
          />
          <span className="text-white text-lg font-semibold">
            {user?.username}
          </span>

          <PrivacyDialog disablePortal className="ml-auto hidden md:block" />
        </div>

        <Separator className="my-4 bg-transparent md:bg-border-dark" />

        <div className="space-y-5">
          {type === "image" && uploadedMedia ? (
            <div>
              <div className={cn("flex items-center gap-1.5", "px-4")}>
                <h3 className="text-muted-foreground-dark text-sm">
                  File controls
                </h3>
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
                <h3 className="text-muted-foreground-dark text-sm">Fonts</h3>
                <FontSelector className="mt-2" />
              </div>

              <div className="px-4">
                <h3 className="text-muted-foreground-dark text-sm">
                  Backgrounds
                </h3>
                <BackgroundSelector
                  className={cn("mt-2", "h-[calc(36px*3+8px*2+12px*2)]")}
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
            <ActionButtons className="mt-auto" />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
