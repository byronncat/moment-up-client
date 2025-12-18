import { useTranslations } from "next-intl";
import { cn } from "@/libraries/utils";
import { Brand } from "@/components/common";
import {
  AsideBackground,
  LanguageSelection,
  ThemeSelection,
} from "./_components";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cn("w-screen h-svh", "flex")}>
      <AsideBackground
        className={cn("min-w-[460px] grow", "hidden lg:block")}
      />
      <RightLayout>{children}</RightLayout>
    </div>
  );
}

function RightLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={cn("size-full lg:max-w-(--breakpoint-md) grow", "relative")}
    >
      <div
        className={cn(
          "flex justify-between items-center",
          "h-15 px-3",
          "absolute top-0 left-0 right-0"
        )}
      >
        <Brand className="select-none" logo logoClassName="h-8" />
        <ThemeSelection />
      </div>
      <div className={cn("h-full", "flex justify-center items-center")}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  const t = useTranslations("AuthFooter");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1",
        "h-16 px-3 pb-4",
        "absolute bottom-0 left-0 right-0",
        "text-xs md:text-sm text-muted-foreground"
      )}
    >
      <div className="flex items-center gap-2">
        <FooterLink>{t("conditionsOfUse")}</FooterLink>
        <span className="text-muted-foreground">|</span>
        <FooterLink>{t("privacyNotice")}</FooterLink>
        <span className="text-muted-foreground">|</span>
        <FooterLink>{t("help")}</FooterLink>
      </div>

      <div className="flex items-center gap-2">
        <span>{t("copyright")}</span>
        <span className="text-border">•</span>
        <LanguageSelection showTooltip={false} />
      </div>
    </div>
  );
}

function FooterLink({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <button type="button" className="hover:underline cursor-pointer">
      {children}
    </button>
  );
}
