import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/icons";

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
      disabled={loading}
      className={cn(
        "w-full",
        "text-white font-semibold",
        "flex justify-center items-center",
        loading && "cursor-wait",
        className
      )}
    >
      <span className="relative">
        {loading ? (
          <Loader
            className={cn(
              "[&&]:size-5",
              "animate-spin",
              "absolute right-[calc(100%+4px)]"
            )}
          />
        ) : null}
        {children}
      </span>
    </Button>
  );
}
