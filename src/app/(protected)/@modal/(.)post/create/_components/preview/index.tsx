import { usePostData } from "../../_provider/PostData";

import { cn } from "@/libraries/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import PostHeader from "./MomentHeader";
import TextContent from "./TextContent";
import MediaGrid from "./MediaGrid";
import ActionButtons from "./ActionButtons";
import { Loader } from "@/components/icons";

export default function Preview() {
  const { isUploading } = usePostData();

  return (
    <ScrollArea
      className={cn(
        "w-[600px] max-w-full h-[calc(100vh-48px)] max-h-fit relative",
        "bg-background relative",
        "cursor-default relative"
      )}
    >
      <div className={cn(isUploading && "animate-pulse")}>
        <PostHeader className="px-4 pt-4 pb-3" />
        <TextContent className="pl-4 pr-5 pb-2" />
        <MediaGrid />
        <ActionButtons />
      </div>

      {isUploading ? (
        <div
          className={cn(
            "absolute inset-0 bg-black/50",
            "flex items-center justify-center"
          )}
        >
          <Loader className="size-10 animate-spin text-white/70" />
        </div>
      ) : null}
    </ScrollArea>
  );
}
