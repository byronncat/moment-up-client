import { cn } from "@/libraries/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import MomentHeader from "./MomentHeader";
import TextContent from "./TextContent";
import MediaGrid from "./MediaGrid";
import ActionButtons from "./ActionButtons";

export default function Preview() {
  return (
    <ScrollArea
      className={cn(
        "w-[600px] max-w-full h-[calc(100vh-48px)] max-h-fit relative",
        "bg-background relative",
        "cursor-default"
      )}
    >
      <MomentHeader className="px-4 pt-4 pb-3" />
      <TextContent className="pl-4 pr-5 pb-2" />
      <MediaGrid />
      <ActionButtons />
    </ScrollArea>
  );
}
