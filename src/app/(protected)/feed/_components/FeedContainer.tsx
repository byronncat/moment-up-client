import { cn } from "@/libraries/utils";

export default function Wrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={cn(
        "size-full bg-background",
        "flex justify-center items-center"
      )}
    >
      <div
        className={cn(
          "aspect-[9/16] h-[calc(100vh-1rem)]",
          "bg-card rounded-lg overflow-hidden shadow-lg",
          "relative"
        )}
      >
        {children}
      </div>
    </div>
  );
}
