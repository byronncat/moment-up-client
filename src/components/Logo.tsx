import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = Readonly<{
  className?: string;
}>;

export default function Logo({ className }: LogoProps) {
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
