import { cn } from "@/libraries/utils";
import Link from "next/link";

type ActionableTextProps = ComponentProps<{
  mutedText?: string;
  path?: string;
  highlightedText: string;
}>;

export default function ActionableText({
  mutedText,
  path,
  highlightedText,
  onClick,
  className,
}: ActionableTextProps) {
  return (
    <div className={cn("text-sm", className)}>
      {mutedText && <span className="text-muted-foreground">{mutedText} </span>}
      {path ? (
        <Link
          href={path}
          className={cn(
            "cursor-pointer",
            "text-primary",
            "font-semibold",
            "hover:opacity-60 transition-opacity duration-150 ease-in-out"
          )}
        >
          {highlightedText}
        </Link>
      ) : (
        <button
          type="button"
          className={cn(
            "cursor-pointer",
            "text-primary",
            "font-semibold",
            "hover:opacity-60 transition-opacity duration-150 ease-in-out"
          )}
          onClick={onClick}
        >
          {highlightedText}
        </button>
      )}
    </div>
  );
}
