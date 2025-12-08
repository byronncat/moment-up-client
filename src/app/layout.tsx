import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.root;

import { SWRConfig } from "swr";
import { NextIntlClientProvider } from "next-intl";
import { AuthProvider, ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background">
        <NextIntlClientProvider>
          <ThemeProvider>
            <SWRConfig
              value={{
                errorRetryCount: 3,
                errorRetryInterval: 12000,
                shouldRetryOnError: false,
              }}
            >
              <AuthProvider>
                <TooltipProvider>{children}</TooltipProvider>
                <Toaster />
              </AuthProvider>
            </SWRConfig>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
