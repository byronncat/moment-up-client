import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
} from "lucide-react";

type ChevronProps = Readonly<{
  direction: "up" | "down" | "left" | "right";
  multiple?: boolean;
  className?: string;
}>;

export default function Chevron({
  direction,
  multiple = false,
  className,
}: ChevronProps) {
  if (multiple) {
    switch (direction) {
      case "up":
        return <ChevronsUp className={className} />;
      case "down":
        return <ChevronsDown className={className} />;
      case "left":
        return <ChevronsLeft className={className} />;
      case "right":
        return <ChevronsRight className={className} />;
    }
  }

  switch (direction) {
    case "up":
      return <ChevronUp className={className} />;
    case "down":
      return <ChevronDown className={className} />;
    case "left":
      return <ChevronLeft className={className} />;
    case "right":
      return <ChevronRight className={className} />;
  }
}
