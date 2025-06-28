"use client";

import { useEffect } from "react";
import { ErrorPage } from "@/components/pages";
import { ThemeProvider } from "@/components/providers";

type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
}>;

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error.message);
  }, [error.message]);

  return (
    <html>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorPage type="internal" />
        </ThemeProvider>
      </body>
    </html>
  );
}
