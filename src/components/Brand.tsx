import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { sourceCodePro } from "@/styles/fonts";
import { ROUTE } from "@/constants/serverConfig";

type BrandProps = Readonly<{
  hyperlink?: boolean;
  className?: string;
}>;

export default function Brand({ hyperlink = true, className }: BrandProps) {
  const Content = () => (
    <div className={cn("flex items-center", className)}>
      <LogoAndText />
    </div>
  );

  if (hyperlink)
    return (
      <Link href={ROUTE.HOME}>
        <Content />
      </Link>
    );
  return <Content />;
}

function LogoAndText() {
  return (
    <>
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
    </>
  );
}
