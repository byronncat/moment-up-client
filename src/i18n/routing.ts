import { defineRouting } from "next-intl/routing";
import { CookieName } from "@/constants/client";

export const routing = defineRouting({
  locales: ["en", "vi"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeCookie: {
    name: CookieName.LOCALE,
  },
});
