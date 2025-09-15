import { Volume2, VolumeOff, VolumeX } from "lucide-react";

type VolumeProps = Readonly<{
  variant?: "regular" | "x" | "off";
  className?: string;
}>;

export default function Volume({
  variant = "regular",
  className,
}: VolumeProps) {
  if (variant === "regular") return <Volume2 className={className} />;
  if (variant === "x") return <VolumeX className={className} />;
  return <VolumeOff className={className} />;
}
