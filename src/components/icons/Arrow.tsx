import { ArrowLeft, ArrowRight } from "lucide-react";

type ArrowProps = Readonly<{
  direction: "left" | "right";
  className?: string;
}>;

export default function Arrow({ direction, className }: ArrowProps) {
  if (direction === "left") return <ArrowLeft className={className} />;
  return <ArrowRight className={className} />;
}
