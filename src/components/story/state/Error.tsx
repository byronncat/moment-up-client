import { cn } from "@/libraries/utils";
import { TriangleAlert } from "@/components/icons";
import Container from "../Container";

type ErrorStateProps = Readonly<{
  onClose: () => void;
  className?: string;
}>;

export default function ErrorState({ onClose, className }: ErrorStateProps) {
  return (
    <Container className={className}>
      <div
        className={cn("flex size-full items-center justify-center", "flex-col")}
      >
        <TriangleAlert className="size-12 mb-3 text-foreground-dark" />
        <p className="text-lg font-semibold text-foreground-dark">
          Something went wrong!
        </p>
        <p className="text-sm text-muted-foreground-dark">
          Please try again later.
        </p>
        <button
          onClick={onClose}
          className={cn(
            "px-4 py-1.5 mt-5",
            "text-sm font-medium",
            "border border-border-dark rounded-md shadow-xs",
            "bg-background-dark hover:bg-accent-dark/10",
            "text-foreground-dark hover:text-accent-foreground-dark",
            "transition-colors duration-75 ease-in-out cursor-pointer"
          )}
        >
          Go back
        </button>
      </div>
    </Container>
  );
}
