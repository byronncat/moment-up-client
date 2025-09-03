import { cn } from "@/libraries/utils";
import Link from "next/link";
import { styles } from "@/constants/clientConfig";

type ActionableTextProps = Readonly<{
  path?: string;
  mutedText?: string;
  highlightedText: string;
  onClick?: () => void;
  className?: string;
}>;

export default function ActionableText({
  path,
  mutedText,
  highlightedText,
  onClick,
  className,
}: ActionableTextProps) {
  return (
    <div className={cn("text-sm", className)}>
      {mutedText ? <span className="text-muted-foreground">{mutedText} </span> : null}
      {path ? (
        <Link
          href={path}
          className={cn(
            "cursor-pointer",
            "text-primary",
            "font-semibold",
            "hover:opacity-60 transition-opacity duration-150 ease-in-out",
            styles.focusVisible,
            "rounded-md"
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
            "hover:opacity-60 transition-opacity duration-150 ease-in-out",
            styles.focusVisible,
            "rounded-md"
          )}
          onClick={onClick}
        >
          {highlightedText}
        </button>
      )}
    </div>
  );
}
