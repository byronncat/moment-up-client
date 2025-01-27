import type { Metadata } from "next";

import clsx from "clsx";
import { AuthProvider, ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import {
  monoton,
  montserrat,
  sourceCodePro,
  yesteryear,
  abel,
} from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | MomentUp",
    default: "MomentUp",
  },
  description:
    "A platform for creating, sharing, and discovering engaging moments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(
          montserrat.variable,
          sourceCodePro.variable,
          yesteryear.variable,
          abel.variable,
          monoton.variable,
          montserrat.className,
          "antialiased",
          "bg-background"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
