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
      <div className="aspect-[9/16] h-[calc(100vh-16px)] relative">
        <div
          className={cn(
            "bg-card-dark text-card-foreground-dark",
            "rounded-lg overflow-hidden shadow-lg size-full"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
