import Link from "next/link";
import clsx from "clsx";
import Logo from "./Logo";
import { sourceCodePro } from "@/styles/fonts";
import { ROUTE } from "@/constants/serverConfig";

type BrandProps = Readonly<{
  hyperlink?: boolean;
  className?: string;
}>;

export default function Brand({ hyperlink = true, className }: BrandProps) {
  const Content = () => (
    <div className={clsx("flex items-center", "inline-block", className)}>
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
      <Logo />
      <span
        className={clsx(
          "ml-2",
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
