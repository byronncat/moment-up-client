import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Circle } from "@/components/icons";
import { RotateCw } from "@/components/icons";

type ErrorContentProps = Readonly<{
  onRefresh: () => void;
  title?: string;
  description?: string;
  className?: string;
}>;

export default function ErrorContent({
  onRefresh,
  title = "Something went wrong!",
  description = "Please try again later.",
  className,
}: ErrorContentProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "h-full",
        className
      )}
    >
      <Circle
        variant="exclamation"
        className="size-12 fill-red-500 dark:fill-red-400"
      />
      <p className={cn("text-lg font-medium", "mt-4")}>{title}</p>
      <p className={cn("text-sm text-muted-foreground", "mt-1")}>
        {description}
      </p>
      <Button
        variant="outline"
        size="sm"
        className={cn("mt-4")}
        onClick={onRefresh}
      >
        <RotateCw className="size-4" />
        Refresh
      </Button>
    </div>
  );
}
