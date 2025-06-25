import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Circle } from "@/components/icons";
import { RotateCw } from "@/components/icons";

export default function ErrorContent({
  onRefresh,
  className,
}: Readonly<{
  onRefresh: () => void;
  className?: string;
}>) {
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
      <p className={cn("text-lg font-medium", "mt-4")}>Something went wrong!</p>
      <p className={cn("text-sm text-muted-foreground", "mt-1")}>
        Please try again later.
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
