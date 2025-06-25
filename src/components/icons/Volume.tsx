import { Volume2, VolumeX } from "lucide-react";

type VolumeProps = Readonly<{
  variant?: "regular" | "x";
  className?: string;
}>;

export default function Volume({
  variant = "regular",
  className,
}: VolumeProps) {
  if (variant === "regular") return <Volume2 className={className} />;
  return <VolumeX className={className} />;
}
