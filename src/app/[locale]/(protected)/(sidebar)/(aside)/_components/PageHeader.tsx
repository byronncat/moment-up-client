import { cn } from "@/libraries/utils";

type PageHeaderProps = Readonly<{
  children?: React.ReactNode;
  title?: string;
  sideButton?: React.ReactNode;
  className?: string;
}>;

export default function PageHeader({
  children,
  title,
  sideButton,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("bg-background/90 backdrop-blur-md", className)}>
      <div className={cn("hidden mobile:block", "pt-5 pl-4 pb-4", "relative")}>
        <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
        <div className="absolute top-6 right-4">{sideButton}</div>
      </div>
      {children}
    </div>
  );
}
