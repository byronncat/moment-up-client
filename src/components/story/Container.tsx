import { cn } from "@/libraries/utils";

type ContainerProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "flex justify-center items-center",
        "bg-background-dark text-foreground-dark",
        className
      )}
    >
      <div
        className={cn(
          "aspect-9/16 w-full max-w-[calc((100vh-16px)*9/16)]",
          "relative"
        )}
      >
        <div
          className={cn(
            "bg-card-dark text-card-foreground-dark",
            "mobile:rounded-lg overflow-hidden",
            "size-full shadow-lg"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
