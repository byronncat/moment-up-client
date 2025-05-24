import { cn } from "@/libraries/utils";

type PageHeaderProps = Readonly<{
  title: string;
  sideButton?: React.ReactNode;
  children?: React.ReactNode;
}>;

export default function PageHeader({
  title,
  sideButton,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("sticky top-0 z-10", "bg-background/70 backdrop-blur-sm")}>
      <div
        className={cn(
          "flex justify-between items-center",
          "pt-7 pl-4 pr-2 pb-4",
        )}
      >
        <h1 className="text-2xl font-bold">{title}</h1>
        {sideButton}
      </div>
      {children}
    </div>
  );
}
