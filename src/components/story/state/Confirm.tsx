import { useParams } from "next/navigation";
import { useState } from "react";
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

  const [textClamped, setTextClamped] = useState<boolean | undefined>(
    undefined
  );

  const isMe = user?.username === username;
  return (
    <Container className={className}>
      {isMe ? (
        <div
          className={cn(
            "size-full",
            "flex items-center justify-center",
            "hover:bg-accent-dark/7",
            "transition-colors duration-75 ease-in-out cursor-pointer"
          )}
          onClick={onConfirm}
        >
          Click to view story
        </div>
      ) : (
        <div
          className={cn(
            "size-full",
            "flex flex-col items-center justify-center",
            "min-w-0"
          )}
        >
          <Avatar src={user?.avatar} alt={`Avatar of ${username}`} size="20" />
          <div
            className={cn(
              "mt-4",
              "text-lg font-bold",
              "max-w-[80%] flex items-center"
            )}
          >
            <span className="shrink-0 mr-1.5">View as</span>
            <span className="truncate">@{user?.username}</span>?
          </div>

          <div
            className={cn(
              "mt-1 px-3",
              "text-sm text-center text-muted-foreground-dark",
              "w-full"
            )}
          >
            <span
              className={cn(
                "font-semibold",
                textClamped === undefined
                  ? "block overflow-x-scroll whitespace-nowrap max-w-full"
                  : textClamped && "line-clamp-1"
              )}
              ref={(element) => {
                if (element && textClamped === undefined)
                  setTextClamped(element.clientWidth < element.scrollWidth);
              }}
            >
              @{username}
            </span>{" "}
            will be able to see that you are viewing their story.
          </div>
          <button
            onClick={onConfirm}
            className={cn(
              "px-4 py-1.5 mt-5",
              "text-sm font-medium",
              "border border-border-dark rounded-md shadow-xs",
              "bg-background-dark hover:bg-accent-dark/10",
              "text-foreground-dark hover:text-accent-foreground-dark",
              "transition-colors duration-75 ease-in-out cursor-pointer"
            )}
          >
            View story
          </button>
        </div>
      )}
    </Container>
  );
}
