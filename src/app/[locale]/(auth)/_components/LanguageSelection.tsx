"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

import { cn } from "@/libraries/utils";
import { Tooltip } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "@/components/icons";

type LanguageSelectionProps = Readonly<{
  showTooltip?: boolean;
  className?: string;
}>;

export default function LanguageSelection({
  showTooltip = true,
  className,
}: LanguageSelectionProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("LanguageSelection");

  const languages = [
    { code: "en", label: t("english") },
    { code: "vi", label: t("vietnamese") },
  ] as const;

  function handleLanguageChange(newLocale: "en" | "vi") {
    router.replace(pathname, { locale: newLocale });
    router.refresh();
  }

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <DropdownMenu>
      <ShowTooltip showTooltip={showTooltip}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground",
              className
            )}
            aria-label="Select language"
          >
            <Globe className="size-4" />
            <span className="text-xs font-medium">
              {currentLanguage?.label}
            </span>
          </Button>
        </DropdownMenuTrigger>
      </ShowTooltip>
      <DropdownMenuContent
        align="center"
        side="top"
        sideOffset={4}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="font-medium min-w-[140px]"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="cursor-pointer"
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ShowTooltip({
  showTooltip,
  children,
}: {
  showTooltip: boolean;
  children: React.ReactNode;
}) {
  return showTooltip ? (
    <Tooltip content="Language" variant="borderless" sideOffset={6}>
      {children}
    </Tooltip>
  ) : (
    children
  );
}
