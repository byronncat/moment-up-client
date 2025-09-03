import { ROUTE } from "@/constants/route";
import { cn } from "@/libraries/utils";
import Link from "next/link";
import Logo from "./Logo";
import { sourceCodePro } from "@/styles/fonts";
import { styles } from "@/constants/clientConfig";

type BrandProps = Readonly<{
  hyperlink?: boolean;
  logo?: boolean;
  className?: string;
}>;

export default function Brand({
  hyperlink = false,
  logo = false,
  className,
}: BrandProps) {
  if (hyperlink)
    return (
      <Link
        href={ROUTE.HOME}
        className={cn(
          "cursor-pointer rounded-md",
          styles.focusVisible,
          className
        )}
      >
        <Content logo={logo} />
      </Link>
    );
  return <Content logo={logo} className={cn("cursor-default", className)} />;
}

function Content({ logo, className }: Omit<BrandProps, "hyperlink">) {
  return (
    <div className={cn("flex items-center", className)}>
      {logo ? <Logo className="h-full mr-2" /> : null}
      <span
        className={cn(
          "inline-block",
          "text-primary",
          "font-bold text-2xl tracking-wide",
          sourceCodePro.className
        )}
      >
        MomentUp
      </span>
    </div>
  );
}
