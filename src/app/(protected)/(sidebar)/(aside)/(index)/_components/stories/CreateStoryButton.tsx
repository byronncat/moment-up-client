import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Plus } from "@/components/icons";
import { ROUTE } from "@/constants/route";

export default function CreateStoryButton({
  className,
}: Readonly<{
  className?: string;
}>) {
  return (
    <Link
      href={ROUTE.STORY_CREATE}
      className={cn(
        "relative group",
        "flex flex-col items-center",
        "cursor-pointer",
        className
      )}
    >
      <div className={cn("flex items-center justify-center", "size-18")}>
        <div
          className={cn(
            "size-16 rounded-full bg-primary/20",
            "flex items-center justify-center",
            "border-2 border-primary",
            "transition-all duration-200",
            "group-hover:scale-105 group-hover:border-primary/70"
          )}
        >
          <Plus className="size-6 text-card-foreground fill-primary" />
        </div>
      </div>
      <span
        className={cn(
          "text-xs font-semibold",
          "inline-block",
          "max-w-16 truncate text-center",
          "transition-colors group-hover:text-primary"
        )}
      >
        Create
      </span>
    </Link>
  );
}
