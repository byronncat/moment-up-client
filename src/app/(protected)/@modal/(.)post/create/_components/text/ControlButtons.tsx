import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "@/components/icons";
import { usePostData } from "../../_provider/PostData";

export default function ControlButtons({
  className,
}: Readonly<{ className?: string }>) {
  const { setPhase } = usePostData();

  return (
    <div className={cn("flex w-full", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full group"
        onClick={() => setPhase("media")}
      >
        <ImageIcon
          variant="plus"
          className={cn(
            "size-4",
            "text-muted-foreground group-hover:text-foreground",
            "transition-colors duration-200 ease-in-out"
          )}
        />
      </Button>
    </div>
  );
}
