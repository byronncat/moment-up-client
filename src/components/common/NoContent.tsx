import { cn } from "@/libraries/utils";

type NoContentProps = Readonly<{
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}>;

export default function NoContent({
  icon,
  title,
  description,
  className,
}: NoContentProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "h-full text-muted-foreground",
        className
      )}
    >
      {icon}
      <p className={cn("text-lg font-semibold", "mt-3")}>{title}</p>
      <p className="text-sm text-center">{description}</p>
    </div>
  );
}
