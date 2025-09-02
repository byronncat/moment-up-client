"use client";

import { useRouter } from "next/navigation";
import { ROUTE } from "@/constants/route";
import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/common";

const errorConfig = {
  "not-found": {
    code: 404,
    title: "Page Not Found",
    description: "The page you are looking for might have been removed or is unavailable.",
    defaultButton: "Go Home",
    defaultRoute: ROUTE.HOME,
  },
  internal: {
    code: 500,
    title: "Internal Server Error",
    description: "Something went wrong! Please try again later or contact support.",
    defaultButton: "Try Again",
    defaultRoute: ROUTE.HOME,
  },
  forbidden: {
    code: 403,
    title: "Access Forbidden",
    description: "You don't have permission to access this resource.",
    defaultButton: "Go Back",
    defaultRoute: ROUTE.HOME,
  },
  maintenance: {
    code: 503,
    title: "Under Maintenance",
    description: "We're currently performing maintenance. Please try again later.",
    defaultButton: "Go Home",
    defaultRoute: ROUTE.HOME,
  },
};

type ErrorType = keyof typeof errorConfig;

type ErrorPageProps = Readonly<{
  type: ErrorType;
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  showButton?: boolean;
}>;

export default function ErrorPage({
  type,
  title: _title,
  description: _description,
  buttonLabel: _buttonLabel,
  buttonHref,
  showButton = true,
}: ErrorPageProps) {
  const router = useRouter();
  const config = errorConfig[type];
  const title = _title ?? config.title;
  const description = _description ?? config.description;
  const buttonLabel = _buttonLabel ?? config.defaultButton;
  const route = buttonHref ?? config.defaultRoute;

  const handleNavigation = () => {
    if (type === "internal" || type === "maintenance") {
      window.location.href = route;
      return;
    }

    try {
      router.push(route);
    } catch {
      window.location.href = route;
    }
  };

  return (
    <div className={cn("w-screen h-svh", "relative", "flex justify-center items-center")}>
      <Brand hyperlink className="absolute top-3 left-4" />
      <main className={cn("flex flex-col items-center", "px-12 text-center")}>
        <Indicator code={config.code} className="mb-4 sm:mb-7" />
        <Description title={title} description={description} className="mb-6 sm:mb-8" />
        {showButton ? (
          <Button className="px-8 md:px-12 py-3" variant="outline" onClick={handleNavigation}>
            {buttonLabel}
          </Button>
        ) : null}
      </main>
    </div>
  );
}

type IndicatorProps = Readonly<{
  code: number;
  className?: string;
}>;

function Indicator({ code, className }: IndicatorProps) {
  return (
    <div
      className={cn("w-full text-center", className)}
      style={{
        background: "radial-gradient(50% 109137.91% at 50% 50%, rgba(176, 0, 32, 0.2) 0%, rgba(254, 244, 247, 0) 100%)",
      }}
    >
      <span
        className={cn(
          "inline-block px-4 py-1",
          "bg-destructive",
          "font-bold text-white",
          "text-xl sm:text-2xl md:text-3xl"
        )}
      >
        {code}
      </span>
    </div>
  );
}

type DescriptionProps = Readonly<{
  title: string;
  description: string;
  className?: string;
}>;

function Description({ title, description, className }: DescriptionProps) {
  return (
    <div className={className}>
      <h1 id="error-title" className={cn("mb-2 sm:mb-5", "font-bold", "text-2xl sm:text-3xl md:text-4xl")}>
        {title}
      </h1>
      <p className={cn("text-muted-foreground", "text-sm sm:text-base md:text-lg")} id="error-description">
        {description}
      </p>
    </div>
  );
}
