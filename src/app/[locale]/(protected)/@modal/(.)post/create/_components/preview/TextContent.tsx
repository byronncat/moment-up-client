import { useState } from "react";
import { usePostData } from "../../_provider/PostData";
import { parseText } from "@/helpers/parser";

import { cn } from "@/libraries/utils";

type TextContentProps = Readonly<{
  className?: string;
}>;

export default function TextContent({ className }: TextContentProps) {
  const { files, text } = usePostData();
  const [isTextClamped, setIsTextClamped] = useState<boolean>();
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
        ref={(element) => {
          if (element && isTextClamped === undefined) {
            const isClamped = element.scrollHeight > element.clientHeight;
            setIsTextClamped(isClamped);
          }
        }}
        className={cn(
          "wrap-break-word whitespace-pre-line",
          hasFiles ? "line-clamp-1" : "line-clamp-2"
        )}
      >
        {parseText(text)}
      </div>
      <span
        className={cn(
          "font-semibold text-sm text-muted-foreground",
          "shrink-0",
          hasFiles && "pl-1",
          isTextClamped ? "block" : "hidden"
        )}
      >
        Show details
      </span>
    </div>
  );
}
