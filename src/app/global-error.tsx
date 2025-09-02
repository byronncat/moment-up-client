"use client";

import { useEffect } from "react";
import { ErrorPage } from "@/components/pages";
import { ThemeProvider } from "@/components/providers";
import "@/styles/globals.css";

type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
}>;

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    if (error.message) console.error(error.message);
  }, [error.message]);

  return (
    <html>
      <body>
        <ThemeProvider>
          <ErrorPage type="internal" />
        </ThemeProvider>
      </body>
    </html>
  );
}
