import { Shield as LucidShield, ShieldAlert, ShieldCheck } from "lucide-react";

type ShieldProps = Readonly<{
  variant?: "check" | "alert" | "regular";
  className?: string;
}>;

export default function Shield({
  variant = "regular",
  className,
}: ShieldProps) {
  if (variant === "check") return <ShieldCheck className={className} />;
  if (variant === "alert") return <ShieldAlert className={className} />;
  return <LucidShield className={className} />;
}
