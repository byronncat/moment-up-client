import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.root;

import { SWRConfig } from "swr";
import { AuthProvider, ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";
import { cn } from "@/libraries/utils";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased bg-background",
          "overflow-y-auto laptop:overflow-y-hidden"
        )}
      >
        <ThemeProvider>
          <SWRConfig
            value={{
              errorRetryCount: 3,
              errorRetryInterval: 12000,
            }}
          >
            <AuthProvider>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster />
            </AuthProvider>
          </SWRConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
