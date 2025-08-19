"use client";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { ROUTE } from "@/constants/route";
import { useRouter } from "next/navigation";

const errorConfig = {
  "not-found": {
    code: 404,
    title: "Page Not Found",
    description:
      "The page you are looking for might have been removed or is unavailable.",
    defaultButton: "Go Home",
    defaultRoute: ROUTE.HOME,
  },
  internal: {
    code: 500,
    title: "Internal Server Error",
    description:
      "Something went wrong! Please try again later or contact support.",
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
    description:
      "We're currently performing maintenance. Please try again later.",
    defaultButton: "Go Home",
    defaultRoute: ROUTE.HOME,
  },
} as const;

type ErrorType = keyof typeof errorConfig;

type ErrorPageProps = Readonly<{
  type: ErrorType;
  customTitle?: string;
  customDescription?: string;
  buttonText?: string;
  buttonRoute?: string;
  showButton?: boolean;
}>;

export default function ErrorPage({
  type,
  customTitle,
  customDescription,
  buttonText,
  buttonRoute,
  showButton = true,
}: ErrorPageProps) {
  const router = useRouter();
  const config = errorConfig[type];
  const title = customTitle || config.title;
  const description = customDescription || config.description;
  const buttonLabel = buttonText || config.defaultButton;
  const route = buttonRoute || config.defaultRoute;

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
    <div
      className={cn("w-screen h-svh", "flex justify-center items-center")}
      role="main"
      aria-labelledby="error-title"
    >
      <div className={cn("flex flex-col items-center", "px-12 text-center")}>
        <Indicator code={config.code} className="mb-7" />
        <Description
          title={title}
          description={description}
          className="mb-10"
        />
        {showButton && (
          <Button
            className="px-12 py-3"
            variant="outline"
            onClick={handleNavigation}
          >
            {buttonLabel}
          </Button>
        )}
      </div>
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
      className={cn("text-center", "w-full", className)}
      style={{
        background:
          "radial-gradient(50% 109137.91% at 50% 50%, rgba(176, 0, 32, 0.2) 0%, rgba(254, 244, 247, 0) 100%)",
      }}
    >
      <div
        className={cn(
          "inline-block px-4 py-1",
          "font-bold text-3xl",
          "bg-red-500 dark:bg-red-400"
        )}
      >
        <span className="text-white">{code}</span>
      </div>
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
      <h1
        id="error-title"
        className={cn("mb-5", "font-bold", "text-3xl laptop:text-4xl")}
      >
        {title}
      </h1>
      <p className="text-muted-foreground" id="error-description">
        {description}
      </p>
    </div>
  );
}
