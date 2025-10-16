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
        "flex flex-col items-center",
        "px-5 text-muted-foreground",
        className
      )}
    >
      {icon}
      <p className={cn("text-lg font-semibold", "mt-2 mb-0.5")}>{title}</p>
      <p className="text-sm text-center">{description}</p>
    </div>
  );
}
