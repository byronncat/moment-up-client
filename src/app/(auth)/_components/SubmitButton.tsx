import { Loader2 } from "lucide-react";
import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = Readonly<{
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}>;

export default function SubmitButton({
  loading,
  children,
  className,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className={cn(
        "size-full h-10",
        "text-white font-semibold",
        "flex justify-center items-center",
        className
      )}
    >
      <span className="relative">
        {loading && (
          <Loader2
            className={cn(
              "[&&]:size-5",
              "animate-spin",
              "absolute right-[calc(100%+4px)]"
            )}
          />
        )}
        {children}
      </span>
    </Button>
  );
}
