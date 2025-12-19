import { useTranslations } from "next-intl";
import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/route";
import Link from "next/link";

export default function AgreementText({
  className,
}: Readonly<{ className?: string }>) {
  const t = useTranslations("AgreementText");

  return (
    <p
      className={cn(
        "text-xs text-center text-muted-foreground leading-relaxed",
        className
      )}
    >
      {t("byContinuing")}{" "}
      <Link
        href={ROUTE.TERMS}
        className="text-primary hover:underline focus-indicator rounded-sm"
      >
        {t("termsOfService")}
      </Link>{" "}
      {t("and")}{" "}
      <Link
        href={ROUTE.PRIVACY}
        className="text-primary hover:underline focus-indicator rounded-sm"
      >
        {t("privacyPolicy")}
      </Link>
      .
    </p>
  );
}
