import { cn } from "@/libraries/utils";
import Link from "next/link";

type ActionableTextProps = Readonly<{
  path?: string;
  mutedText?: string;
  highlightedText: string;
  onClick?: () => void;
  className?: string;
}>;

const styles = cn(
  "cursor-pointer",
  "text-primary",
  "font-semibold",
  "hover:opacity-60 transition-opacity duration-75 ease-in-out",
  "focus-indicator rounded-sm"
);

export default function ActionableText({
  path,
  mutedText,
  highlightedText,
  onClick,
  className,
}: ActionableTextProps) {
  return (
    <div className={cn("text-sm", className)}>
      {mutedText ? (
        <span className="text-muted-foreground">{mutedText} </span>
      ) : null}
      {path ? (
        <Link href={path} className={styles}>
          {highlightedText}
        </Link>
      ) : (
        <button type="button" className={styles} onClick={onClick}>
          {highlightedText}
        </button>
      )}
    </div>
  );
}
