import { useRef, useState } from "react";
import { parseText } from "@/helpers/parser";
import { cn } from "@/libraries/utils";

type TextProps = Readonly<{
  text: string | null;
  hasFiles: boolean;
}>;

export default function Text({ text, hasFiles }: TextProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [firstTextClamped, setFirstTextClamped] = useState(false);
  const counter = useRef(0);

  if (!text) return null;
  return (
    <div
      className={cn(
        "flex pl-4 pr-5 pb-2",
        "text-sm",
        isExpanded
          ? "flex-col items-start gap-1"
          : hasFiles
            ? "flex-row items-center gap-1"
            : "flex-col items-start gap-1"
      )}
    >
      <div
        ref={(ref) => {
          textRef.current = ref;
          if (ref && counter.current === 0) {
            setFirstTextClamped(ref.scrollHeight > ref.clientHeight);
            counter.current++;
          }
        }}
        className={cn(
          "wrap-break-word",
          !isExpanded && (hasFiles ? "line-clamp-1" : "line-clamp-2")
        )}
      >
        {parseText(text)}
      </div>

      <button
        className={cn(
          "font-semibold text-sm text-muted-foreground",
          "cursor-pointer hover:underline",
          "focus:underline outline-none",
          "shrink-0",
          firstTextClamped ? "block" : "hidden"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Show {isExpanded ? "less" : "more"}
      </button>
    </div>
  );
}
