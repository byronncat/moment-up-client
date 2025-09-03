import { useEffect } from "react";
import { useTextTruncate, useScrollAnimation } from "@/hooks";

import { cn } from "@/libraries/utils";
import { Badge } from "@/components/ui/badge";
import { Volume, Trash } from "@/components/icons";
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
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex items-center gap-2",
            "max-w-[272px] min-w-0 flex-1"
          )}
        >
          <Volume className="size-5 text-accent-dark flex-shrink-0" />
          <ScrollingText
            text={name}
            className="text-sm font-medium text-white flex-1"
          />
        </div>
        <button
          onClick={handleRemoveAudio}
          className={cn(
            "p-1.5 -mr-2 flex-shrink-0",
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
          "self-end mt-2 -mr-1 -mb-1",
          "text-xs text-muted-foreground-dark",
          "border-accent-dark/12"
        )}
      >
        <Save className="size-3" /> {(size / (1024 * 1024)).toFixed(2)} MB
      </Badge>
    </div>
  );
}

const SCROLL_OFFSET = 20;

type ScrollingTextProps = Readonly<{
  text: string;
  className?: string;
}>;

function ScrollingText({ text, className }: ScrollingTextProps) {
  const { containerRef, textRef, isTruncated } = useTextTruncate(text);
  const { animationStyle, calculateAnimation } = useScrollAnimation({
    scrollSpeed: SCROLL_OFFSET,
    minDuration: 3,
  });

  useEffect(() => {
    if (isTruncated && containerRef.current && textRef.current) {
      const scrollDistance =
        textRef.current.scrollWidth - containerRef.current.offsetWidth;
      calculateAnimation(scrollDistance);
    } else calculateAnimation(0);
  }, [isTruncated, containerRef, textRef, calculateAnimation]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden relative", className)}
    >
      <span
        ref={textRef}
        className={cn(
          "inline-block whitespace-nowrap",
          isTruncated && "animate-scroll-text"
        )}
        style={isTruncated ? animationStyle : undefined}
      >
        {text}
      </span>
    </div>
  );
}
