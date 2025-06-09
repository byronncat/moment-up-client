import { cn } from "@/libraries/utils";

export default function ListLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={cn(
        "flex flex-col h-full",
        "border-x border-border",
        "relative"
      )}
    >
      {children}
    </div>
  );
}
