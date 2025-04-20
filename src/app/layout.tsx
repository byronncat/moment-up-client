import { AuthProvider, ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "@/constants/metadata";
import "@/styles/globals.css";

export const metadata = Metadata.root;
export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
