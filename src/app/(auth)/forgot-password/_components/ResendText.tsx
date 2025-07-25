import { useEffect, useState } from "react";
import { cn } from "@/libraries/utils";

const RESEND_TIME = 60; // seconds
export default function ResendText({
  onClick,
}: Readonly<{ onClick?: () => void }>) {
  const [resendTime, setResendTime] = useState(0);
  const isDisabled = resendTime > 0;

  const handleResend = () => {
    if (onClick) onClick();
    setResendTime(RESEND_TIME);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDisabled)
      interval = setInterval(() => setResendTime((prev) => prev - 1), 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isDisabled]);

  return (
    <div className={cn("text-sm text-center", "w-full", isDisabled && "-ml-3")}>
      <span className="text-muted-foreground">
        Didn&apos;t receive the code?{" "}
      </span>
      <button
        disabled={isDisabled}
        type="button"
        className={cn(
          "relative",
          "cursor-pointer",
          "text-primary font-semibold",
          "hover:opacity-60 transition-opacity duration-150 ease-in-out",
          "disabled:opacity-50 disabled:cursor-default"
        )}
        onClick={handleResend}
      >
        Resend
        {isDisabled && (
          <span
            className={cn("inline-block", "absolute left-[calc(100%+4px)]")}
          >{`(${resendTime}s)`}</span>
        )}
      </button>
    </div>
  );
}
