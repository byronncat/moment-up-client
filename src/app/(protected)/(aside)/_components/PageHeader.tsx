import { cn } from "@/libraries/utils";

type PageHeaderProps = Readonly<{
  title?: string;
  sideButton?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}>;

export const HEADER_HEIGHT = 76;

export default function PageHeader({
  title,
  sideButton,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("bg-background/90 backdrop-blur-md", className)}>
      <div className={cn("hidden laptop:block", "pt-7 pl-4 pb-4", "relative")}>
        <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
        <div className="absolute top-6 right-4">{sideButton}</div>
      </div>
      {children}
    </div>
  );
}
