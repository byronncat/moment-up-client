import {
  ImagePlus,
  Image as LucideImage,
  Images as LucideImages,
} from "lucide-react";

type ImageProps = Readonly<{
  variant?: "plus" | "regular";
  multiple?: boolean;
  className?: string;
}>;

export default function Image({
  variant = "regular",
  multiple = false,
  className,
}: ImageProps) {
  if (variant === "plus") return <ImagePlus className={className} />;
  if (multiple) return <LucideImages className={className} />;
  return <LucideImage className={className} />;
}
