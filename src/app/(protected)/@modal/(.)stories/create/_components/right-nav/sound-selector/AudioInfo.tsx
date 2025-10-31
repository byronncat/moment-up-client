import { cn } from "@/libraries/utils";
import { Badge } from "@/components/ui/badge";
import { Trash, Volume } from "@/components/icons";
import { Save } from "lucide-react";

type AudioInfoProps = Readonly<{
  name: string;
  size: number;
  handleRemoveAudio: () => void;
  className?: string;
}>;

export default function AudioInfo({
  name,
  size,
  handleRemoveAudio,
  className,
}: AudioInfoProps) {
  return (
    <div className={cn("w-full flex flex-col", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className={cn("flex items-center gap-2", "min-w-0 flex-1")}>
          <Volume className="size-5 text-accent-dark shrink-0" />
          <div
            className={cn(
              "text-sm font-medium text-white flex-1",
              "truncate min-w-0"
            )}
          >
            {name}
          </div>
        </div>

        <button
          onClick={handleRemoveAudio}
          className={cn(
            "p-1.5 shrink-0",
            "rounded hover:bg-destructive/20",
            "text-muted-foreground-dark hover:text-destructive",
            "transition-colors",
            "cursor-pointer"
          )}
        >
          <Trash className="size-4" />
        </button>
      </div>

      <Badge
        variant="outline"
        className={cn(
          "self-end mt-1 -mr-1 -mb-1",
          " text-muted-foreground-dark",
          "border-accent-dark/12"
        )}
      >
        <Save className="size-3" />
        {(size / (1024 * 1024)).toFixed(2)} MB
      </Badge>
    </div>
  );
}
