import { cn } from "@/libraries/utils";

type PageHeaderProps = Readonly<{
  title?: string;
  sideButton?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}>;

export default function PageHeader({
  title,
  sideButton,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("bg-background/90 backdrop-blur-md", className)}>
      <div
        className={cn(
          "flex justify-between items-center",
          "pt-7 pl-4 pr-2 pb-4"
        )}
      >
        <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
        {sideButton}
      </div>
      {children}
    </div>
  );
}
