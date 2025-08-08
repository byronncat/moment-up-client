import { useParams } from "next/navigation";
import { useAuth } from "@/components/providers/Auth";
import { cn } from "@/libraries/utils";
import Container from "../Container";
import { Avatar } from "@/components/common";

type ConfirmStateProps = Readonly<{
  onConfirm: () => void;
  className?: string;
}>;

export default function ConfirmState({
  onConfirm,
  className,
}: ConfirmStateProps) {
  const { user } = useAuth();
  const params = useParams();
  const username = params.username as string;

  return (
    <Container className={className}>
      <div
        className={cn("size-full", "flex flex-col items-center justify-center")}
      >
        <Avatar src={user?.avatar} alt={`Avatar of ${username}`} size="20" />
        <div className="mt-4 text-lg font-bold">View as {user?.username}?</div>
        <p className="mt-1 text-sm">
          {username} will be able to see that you are viewing their story.
        </p>
        <button
          onClick={onConfirm}
          className={cn(
            "px-4 py-1.5 mt-5",
            "text-sm font-medium",
            "border border-border-dark rounded-md shadow-xs",
            "bg-background-dark hover:bg-accent-dark/[.1]",
            "text-foreground-dark hover:text-accent-foreground-dark",
            "transition-colors duration-75 ease-in-out cursor-pointer"
          )}
        >
          View story
        </button>
      </div>
    </Container>
  );
}
