import { ROUTE } from "@/constants/route";
import { cn } from "@/libraries/utils";
import Link from "next/link";
import Logo from "./Logo";
import { sourceCodePro } from "@/styles/fonts";

type BrandProps = Readonly<{
  hyperlink?: boolean;
  logo?: boolean;
  className?: string;
  logoClassName?: string;
}>;

export default function Brand({
  hyperlink = false,
  logo = false,
  className,
  logoClassName,
}: BrandProps) {
  if (hyperlink)
    return (
      <Link
        href={ROUTE.HOME}
        className={cn(
          "cursor-pointer",
          "focus-within-indicator rounded-sm",
          className
        )}
      >
        <Content logo={logo} logoClassName={logoClassName} />
      </Link>
    );
  return (
    <Content
      logo={logo}
      className={cn("cursor-default", className)}
      logoClassName={logoClassName}
    />
  );
}

function Content({
  logo,
  className,
  logoClassName,
}: Omit<BrandProps, "hyperlink">) {
  return (
    <div className={cn("flex items-center", className)}>
      {logo ? <Logo className={cn("mr-2", logoClassName)} /> : null}
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
