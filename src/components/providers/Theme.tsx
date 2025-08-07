import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LocalStorageKey } from "@/constants/clientConfig";

export default function ThemeProvider({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey={LocalStorageKey.THEME}
    >
      {children}
    </NextThemesProvider>
  );
}
