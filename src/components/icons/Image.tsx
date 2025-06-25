import { Image as LucideImage, Images as LucideImages } from "lucide-react";

type ImageProps = Readonly<{
  multiple?: boolean;
  className?: string;
}>;

export default function Image({ multiple = false, className }: ImageProps) {
  if (multiple) return <LucideImages className={className} />;
  return <LucideImage className={className} />;
}
