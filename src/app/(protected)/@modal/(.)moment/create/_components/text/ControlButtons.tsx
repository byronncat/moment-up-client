import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "@/components/icons";
import { useMomentData } from "../../_provider/MomentData";

export default function ControlButtons({
  className,
}: Readonly<{ className?: string }>) {
  const { setPhase } = useMomentData();

  return (
    <div className={cn("flex w-full", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full group"
        onClick={() => setPhase("media")}
      >
        <ImageIcon
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
