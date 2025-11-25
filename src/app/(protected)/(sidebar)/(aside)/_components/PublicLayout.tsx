"use client";

import { useAuth } from "@/components/providers";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { sourceCodePro } from "@/styles/fonts";

export default function PublicLayout({
  borderBottom = false,
  children,
}: Readonly<{ borderBottom?: boolean; children: React.ReactNode }>) {
  return (
    <>
      <Header
        title="MomentUp"
        borderBottom={borderBottom}
        className={cn(
          "sticky top-0 left-0 z-10 w-full",
          "bg-background/90 backdrop-blur-md"
        )}
      />
      {children}
    </>
  );
}

export function Header({
  title,
  borderBottom,
  className,
}: Readonly<{ title: string; borderBottom: boolean; className?: string }>) {
  const { user } = useAuth();

  return user ? null : (
    <div
      className={cn(
        "flex items-center justify-between",
        "px-4 h-15 shrink-0",
        "xl:hidden",
        borderBottom && "border-b border-border",
        className
      )}
    >
      <Link
        href={ROUTE.LOGIN}
        className={cn(
          "text-primary",
          "font-bold text-2xl tracking-wide",
          "select-none",
          sourceCodePro.className
        )}
      >
        {title}
      </Link>
    </div>
  );
}

export function AuthenticatedButtons() {
  return (
    <div className={cn("flex items-center gap-2", "lg:hidden")}>
      <Button variant="default" size="sm" className="font-semibold w-18">
        Login
      </Button>
      <Button variant="outline" size="sm" className="w-18">
        Sign up
      </Button>
    </div>
  );
}
