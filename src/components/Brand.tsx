import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { sourceCodePro } from "@/styles/fonts";
import { ROUTE } from "@/constants/serverConfig";

interface BrandProps {
  hyperlink?: boolean;
  className?: string;
}

export default function Brand({
  hyperlink = true,
  className,
}: Readonly<BrandProps>) {
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
      <span
        className={clsx("inline-block", "h-full aspect-square", "relative")}
      >
        <Image
          src="/moment-up.svg"
          alt="logo"
          className="rounded-md select-none"
          fill
          sizes="40px"
        />
      </span>
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
