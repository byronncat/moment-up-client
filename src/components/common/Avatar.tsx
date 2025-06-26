import { cn } from "@/libraries/utils";
import { Avatar as AvatarUI, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User } from "../icons";

type AvatarProps = Readonly<{
  src?: string;
  alt?: string;
  size: "7" | "10" | "12" | "14" | "26";
  ring?: boolean;
  showRing?: boolean;
  className?: string;
}>;

const sizeClass = {
  "7": {
    ring: "size-8",
    avatar: "size-7",
    userFallback: "size-3.5",
  },
  "10": {
    ring: "size-12",
    avatar: "size-10",
    userFallback: "size-5",
  },
  "12": {
    ring: "size-14",
    avatar: "size-12",
    userFallback: "size-6",
  },
  "14": {
    ring: "size-16",
    avatar: "size-14",
    userFallback: "size-8",
  },
  "26": {
    ring: "size-28",
    avatar: "size-26",
    userFallback: "size-14",
  },
};

export default function Avatar({
  src,
  alt,
  size,
  ring = false,
  showRing = true,
  className,
}: AvatarProps) {
  const sizeStyles = sizeClass[size];
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
      <AvatarImage src={src} alt={alt} className="object-cover object-top select-none" />
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
