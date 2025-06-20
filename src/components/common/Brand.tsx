import Link from "next/link";
import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/clientConfig";
import Logo from "./Logo";
import { sourceCodePro } from "@/styles/fonts";

type BrandProps = Readonly<{
  hyperlink?: boolean;
  className?: string;
}>;

export default function Brand({ hyperlink = true, className }: BrandProps) {
  if (hyperlink)
    return (
      <Link href={ROUTE.HOME}>
        <Content className={className} />
      </Link>
    );
  return <Content className={className} />;
}

function Content({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("flex items-center", className)}>
      <Logo className="h-full mr-2" />
      <span
        className={cn(
          "inline-block",
          "text-primary",
          "font-bold text-2xl tracking-wide",
          "cursor-default",
          sourceCodePro.className
        )}
      >
        MomentUp
      </span>
    </div>
  );
}
