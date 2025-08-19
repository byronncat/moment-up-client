import { cn } from "@/libraries/utils";

type HeaderProps = {
  title: string;
  className?: string;
};

export default function Header({ title, className }: HeaderProps) {
  return (
    <div className={cn("px-4", className)}>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
}
