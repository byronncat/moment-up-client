import { cn } from "@/lib/utils";
import Link from "next/link";

type NavigationTextProps = Readonly<{
  text?: string;
  path: string;
  hyperlink: string;
  className?: string;
}>;

export default function NavigationText({
  text,
  path,
  hyperlink,
  className,
}: NavigationTextProps) {
  return (
    <div className={cn("text-sm", className)}>
      {text && <span className="text-muted-foreground">{text} </span>}
      <Link
        href={path}
        className={cn(
          "text-primary",
          "font-semibold",
          "hover:opacity-60 transition-opacity duration-150 ease-in-out"
        )}
      >
        {hyperlink}
      </Link>
    </div>
  );
}
