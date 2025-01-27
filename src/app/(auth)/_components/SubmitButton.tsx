import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = Readonly<{
  loading?: boolean;
  children?: React.ReactNode;
}>;

export default function SubmitButton({ loading, children }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className={cn(
        "size-full h-10 mt-6",
        "text-white font-semibold",
        "flex justify-center items-center"
      )}
    >
      <span className="relative">
        {loading && (
          <Loader2
            className={cn(
              "[&&]:size-5",
              "animate-spin",
              "absolute right-[calc(100%+0.25rem)]"
            )}
          />
        )}
        {children}
      </span>
    </Button>
  );
}
