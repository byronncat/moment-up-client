import { Logo } from "@/components";
import { cn } from "@/libraries/utils";

export default function NoMoments() {
  return (
    <div className={cn("flex flex-col items-center justify-center", "h-full")}>
      <Logo className="size-12" />
      <p className={cn("text-lg font-medium", "mt-4")}>No moments yet</p>
      <p className={cn("text-sm text-muted-foreground", "mt-1")}>
        When anyone you follow posts, they&apos;ll show up here.
      </p>
    </div>
  );
}
