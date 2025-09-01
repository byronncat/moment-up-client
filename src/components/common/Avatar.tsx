import type { AccountInfo } from "api";

import { cn } from "@/libraries/utils";
import { Avatar as AvatarUI, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User } from "../icons";

const sizeConfig = {
  "7": { ring: "size-8", avatar: "size-7", userFallback: "size-3.5" },
  "10": { ring: "size-12", avatar: "size-10", userFallback: "size-5" },
  "12": { ring: "size-14", avatar: "size-12", userFallback: "size-6" },
  "14": { ring: "size-16", avatar: "size-14", userFallback: "size-8" },
  "20": { ring: "size-22", avatar: "size-20", userFallback: "size-10" },
  "26": { ring: "size-28", avatar: "size-26", userFallback: "size-14" },
} as const;

type AvatarSize = keyof typeof sizeConfig;

type AvatarProps = Readonly<{
  src: AccountInfo["avatar"] | undefined;
  size: AvatarSize;
  alt?: string;
  ring?: boolean;
  showRing?: boolean;
  className?: string;
}>;

export default function Avatar({
  src,
  alt,
  size,
  ring = false,
  showRing = true,
  className,
}: AvatarProps) {
  const sizeStyles = sizeConfig[size];
  const Ring = ({
    children,
    className,
  }: Readonly<{
    children: React.ReactNode;
    className?: string;
  }>) => (
    <div
      className={cn(
        sizeStyles.ring,
        "rounded-full",
        "flex items-center justify-center",
        "border-2",
        showRing ? "border-primary" : "border-transparent",
        className
      )}
    >
      {children}
    </div>
  );

  const CircleImage = ({ className }: Readonly<{ className?: string }>) => (
    <AvatarUI className={cn(sizeStyles.avatar, className)}>
      <AvatarImage
        src={src || undefined}
        alt={alt}
        className="object-cover object-top select-none"
      />
      <AvatarFallback className="bg-primary">
        <User
          className={cn(sizeStyles.userFallback, "fill-card")}
          type="solid"
        />
      </AvatarFallback>
    </AvatarUI>
  );

  if (ring) {
    return (
      <Ring className={className}>
        <CircleImage />
      </Ring>
    );
  }

  return <CircleImage className={className} />;
}
