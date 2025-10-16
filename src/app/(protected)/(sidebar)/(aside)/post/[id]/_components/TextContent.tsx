import type { FeedItemDto } from "api";
import { useState } from "react";
import { parseText } from "@/helpers/parser";
import { cn } from "@/libraries/utils";

export default function TextContent({
  data,
}: Readonly<{ data: FeedItemDto["post"]["text"] }>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  function handleToggleExpand() {
    setIsExpanded(!isExpanded);
  }

  if (!data) return <div className="h-2" />;
  return (
    <div className={cn("pl-4 pr-5 pb-3", "text-sm")}>
      <div
        ref={(element) => {
          if (element && canExpand === undefined) {
            const isTextClamped = element.scrollHeight > element.clientHeight;
            setCanExpand(isTextClamped);
          }
        }}
        className={cn(!isExpanded && "line-clamp-5", "space-y-2")}
      >
        {parseText(data)}
      </div>
      {canExpand ? (
        <ShowToggle
          onClick={handleToggleExpand}
          text={isExpanded ? "Show less" : "Show more"}
        />
      ) : null}
    </div>
  );
}

type ShowToggleProps = Readonly<{
  onClick: () => void;
  text: string;
  className?: string | boolean;
}>;

function ShowToggle({ onClick, text, className }: ShowToggleProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "pt-1",
        "font-semibold text-sm text-muted-foreground",
        "cursor-pointer hover:underline",
        "transition-opacity duration-150",
        className
      )}
    >
      {text}
    </button>
  );
}
