import { useRef } from "react";
import { useTextClamp } from "@/hooks";
import { parseText } from "@/helpers/parser";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";

type TextProps = Readonly<{
  text?: string;
  hasFiles: boolean;
  momentId: string;
}>;

export default function Text({ text, hasFiles, momentId }: TextProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const isTextClamped = useTextClamp(textRef);

  if (!text) return null;
  return (
    <div
      className={cn(
        "flex px-4 pb-2",
        "text-sm",
        hasFiles ? "flex-row items-center" : "flex-col items-start gap-1"
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
      <Link
        href={ROUTE.MOMENT(momentId)}
        className={cn(
          "font-semibold text-sm text-muted-foreground",
          "cursor-pointer hover:underline",
          "shrink-0",
          "opacity-0",
          isTextClamped && "!opacity-100"
        )}
      >
        Show details
      </Link>
    </div>
  );
}
