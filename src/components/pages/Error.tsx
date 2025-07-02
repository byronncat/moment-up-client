import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTE } from "@/constants/route";

const Error = {
  "not-found": {
    code: 404,
    title: "page not found",
    description:
      "The page you are looking for might have been removed or is unavailable.",
  },
  internal: {
    code: 500,
    title: "internal server",
    description:
      "Something went wrong! Please try again later or contact support.",
  },
};

type ErrorPageProps = Readonly<{
  type: "not-found" | "internal";
  navigateButton?: boolean;
}>;

export default function ErrorPage({
  type,
  navigateButton = false,
}: ErrorPageProps) {
  const error = Error[type];
  return (
    <div className={cn("w-screen h-svh", "flex justify-center items-center")}>
      <div className={cn("flex flex-col items-center", "px-12 text-center")}>
        <Indicator code={error.code} className="mb-7" />
        <Description
          title={error.title}
          description={error.description}
          className="mb-10"
        />
        {navigateButton && (
          <Link href={ROUTE.LOGIN}>
            <Button className="px-12 py-3" variant="outline">
              Go to main page
            </Button>
          </Link>
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
        className={cn(
          "mb-5",
          "font-bold capitalize",
          "text-3xl laptop:text-4xl"
        )}
      >
        {title}
      </h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
