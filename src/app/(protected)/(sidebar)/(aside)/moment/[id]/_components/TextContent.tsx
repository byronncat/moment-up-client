import type { MomentInfo } from "api";
import { useRef, useState } from "react";
import { useTextClamp } from "@/hooks";
import { parseText } from "@/helpers/parser";
import { cn } from "@/libraries/utils";

export default function TextContent({
  data,
}: Readonly<{ data: MomentInfo["post"]["text"] }>) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isTextClamped = useTextClamp(textRef);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!data) return <div className="h-2" />;
  return (
    <div className={cn("pl-4 pr-5 pb-3", "text-sm")}>
      <div
        ref={textRef}
        className={cn(!isExpanded && "line-clamp-5", "space-y-2")}
      >
        {parseText(data)}
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
      {isTextClamped && isExpanded && (
        <ShowToggle
          onClick={handleToggleExpand}
          text={isExpanded ? "Show less" : "Show more"}
        />
      )}
    </div>
  );
}

function ShowToggle({
  onClick,
  text,
}: Readonly<{
  onClick: () => void;
  text: string;
}>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "pt-1",
        "font-semibold text-sm text-muted-foreground",
        "cursor-pointer hover:underline",
        "transition-opacity duration-150"
      )}
    >
      {text}
    </button>
  );
}
