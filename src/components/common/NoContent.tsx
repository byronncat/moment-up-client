import { Logo } from "@/components";
import { cn } from "@/libraries/utils";

type NoContentProps = Readonly<{
  title: string;
  description: string;
}>;

export default function NoContent({ title, description }: NoContentProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", "h-full")}>
      <Logo className="size-12" />
      <p className={cn("text-lg font-medium", "mt-4")}>{title}</p>
      <p className={cn("text-sm text-muted-foreground", "mt-1")}>
        {description}
      </p>
    </div>
  );
}
