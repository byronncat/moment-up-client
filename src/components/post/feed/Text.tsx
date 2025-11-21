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
  const [firstTextClamped, setFirstTextClamped] = useState<boolean | undefined>(
    undefined
  );

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
        ref={(element) => {
          textRef.current = element;
          if (element && firstTextClamped === undefined)
            setFirstTextClamped(element.scrollHeight > element.clientHeight);
        }}
        className={cn(
          "wrap-break-word whitespace-pre-line",
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
