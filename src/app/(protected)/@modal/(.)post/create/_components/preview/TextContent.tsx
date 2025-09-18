import { useRef } from "react";
import { useTextClamp } from "@/hooks";
import { usePostData } from "../../_provider/PostData";
import { parseText } from "@/helpers/parser";

import { cn } from "@/libraries/utils";

type TextContentProps = Readonly<{
  className?: string;
}>;

export default function TextContent({ className }: TextContentProps) {
  const { files, text } = usePostData();
  const textRef = useRef<HTMLParagraphElement>(null);

  const isTextClamped = useTextClamp(textRef);
  const hasFiles = !!files.length;

  if (!text) return null;
  return (
    <div
      className={cn(
        "flex text-sm",
        className,
        hasFiles
          ? "flex-row items-center"
          : "flex-col items-start gap-1 h-[72px]"
      )}
    >
      <div
        ref={textRef}
        className={cn(
          "wrap-break-word",
          hasFiles ? "line-clamp-1" : "line-clamp-2"
        )}
      >
        {parseText(text)}
      </div>
      <span
        className={cn(
          "font-semibold text-sm text-muted-foreground",
          "shrink-0 pl-1",
          isTextClamped ? "block" : "hidden"
        )}
      >
        Show details
      </span>
    </div>
  );
}
