import Image from "next/image";
import { cn } from "@/libraries/utils";

export default function Logo({ className }: ComponentProps) {
  return (
    <span
      className={cn(
        "inline-block",
        "h-full aspect-square",
        "relative",
        className
      )}
    >
      <Image
        src="/moment-up.svg"
        alt="logo"
        className="rounded-md select-none"
        fill
        sizes="40px"
      />
    </span>
  );
}
