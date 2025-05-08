import { cn } from "@/libraries/utils";

export default function Modal({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={cn(
        "top-0 right-0 absolute z-10",
        "w-screen h-screen",
        "flex items-center justify-center"
      )}
    >
      {children}
    </div>
  );
}
