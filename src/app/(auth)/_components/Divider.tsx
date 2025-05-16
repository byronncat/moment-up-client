import { cn } from "@/libraries/utils";

type DividerProps = ComponentProps<{
  text?: string;
}>;

export default function Divider({ text, className }: DividerProps) {
  return (
    <div className={cn("flex items-center gap-4", "cursor-default", className)}>
      <div className={cn("h-px grow", "bg-border")} />
      {text && <span className="text-muted-foreground">{text}</span>}
      <div className={cn("h-px grow", "bg-border")} />
    </div>
  );
}
