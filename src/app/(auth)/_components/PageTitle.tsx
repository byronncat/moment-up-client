import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const titleVariants = cva("text-center cursor-default", {
  variants: {
    variant: {
      default: "font-source-code-pro font-bold text-4xl mb-6",
      secondary: "text-2xl font-bold mb-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface PageTitleProps extends VariantProps<typeof titleVariants> {
  title: string;
  className?: string;
}

export default function PageTitle({
  title,
  variant,
  className,
}: PageTitleProps) {
  return <h2 className={cn(titleVariants({ variant, className }))}>{title}</h2>;
}
