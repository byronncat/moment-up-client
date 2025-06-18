import type { DetailedMomentInfo } from "api";
import { useRef, useState } from "react";
import { useTextClamp } from "@/hooks";
import { cn } from "@/libraries/utils";

export default function TextContent({
  data,
}: Readonly<{ data: DetailedMomentInfo["post"]["text"] }>) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isTextClamped = useTextClamp(textRef);

  if (!data) return null;

  const formattedText = data
    .split("\n")
    .map((line, index) => <p key={index}>{line}</p>);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="px-3 pb-3">
      <div
        ref={textRef}
        className={cn(!isExpanded && "line-clamp-5", "space-y-2")}
      >
        {formattedText}
      </div>
      {isTextClamped && !isExpanded && (
        <button
          onClick={handleToggleExpand}
          className={cn(
            "pt-1",
            "font-semibold text-sm text-muted-foreground",
            "cursor-pointer hover:underline",
            "transition-opacity duration-150"
          )}
        >
          Show more
        </button>
      )}
      {isExpanded && (
        <button
          onClick={handleToggleExpand}
          className={cn(
            "pt-1",
            "font-semibold text-sm text-muted-foreground",
            "cursor-pointer hover:underline",
            "transition-opacity duration-150"
          )}
        >
          Show less
        </button>
      )}
    </div>
  );
}
