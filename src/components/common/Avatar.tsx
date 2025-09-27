import type { AccountDto } from "api";

import { cn } from "@/libraries/utils";
import { AvatarFallback, AvatarImage, Avatar as AvatarUI } from "../ui/avatar";
import { User } from "../icons";

const sizeConfig = {
  "7": { ringAvatar: "size-5", avatar: "size-7", userFallback: "size-3.5" },
  "10": { ringAvatar: "size-8", avatar: "size-10", userFallback: "size-5" },
  "12": { ringAvatar: "size-10", avatar: "size-12", userFallback: "size-6" },
  "14": { ringAvatar: "size-12", avatar: "size-14", userFallback: "size-8" },
  "20": { ringAvatar: "size-18", avatar: "size-20", userFallback: "size-10" },
  "22": { ringAvatar: "size-20", avatar: "size-22", userFallback: "size-11" },
  "24": { ringAvatar: "size-22", avatar: "size-24", userFallback: "size-12" },
  "26": { ringAvatar: "size-24", avatar: "size-26", userFallback: "size-14" },
} as const;

export type AvatarSize = keyof typeof sizeConfig;

type AvatarProps = Readonly<{
  src: AccountDto["avatar"] | undefined;
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
  if (ring && showRing)
    return (
      <div
        className={cn(
          sizeStyles.avatar,
          "rounded-full relative",
          "flex items-center justify-center",
          className
        )}
      >
        <span className="absolute inset-0 rounded-full border-2 border-primary" />

        <AvatarUI className={cn(sizeStyles.ringAvatar, className)}>
          <AvatarImage
            src={src ?? undefined}
            alt={alt}
            className="object-cover object-top select-none ring-1 ring-primary"
          />
          <AvatarFallback className="bg-primary">
            <User
              className={cn(sizeStyles.userFallback, "fill-card")}
              type="solid"
            />
          </AvatarFallback>
        </AvatarUI>
      </div>
    );

  return (
    <AvatarUI className={cn(sizeStyles.avatar, className)}>
      <AvatarImage
        src={src ?? undefined}
        alt={alt}
        className="object-cover object-top select-none ring-1 ring-primary"
      />
      <AvatarFallback className="bg-primary">
        <User
          className={cn(sizeStyles.userFallback, "fill-card")}
          type="solid"
        />
      </AvatarFallback>
    </AvatarUI>
  );
}
