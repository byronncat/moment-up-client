import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/libraries/utils";

const RESEND_TIME = 60; // seconds
export default function ResendText({
  onClick,
}: Readonly<{ onClick?: () => void }>) {
  const t = useTranslations("ForgotPasswordPage");
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
      <span className="text-muted-foreground">{t("didntReceiveCode")} </span>
      <button
        disabled={isDisabled}
        className={cn(
          "relative",
          "cursor-pointer",
          "text-primary font-semibold",
          "hover:opacity-60 transition-opacity duration-150 ease-in-out",
          "disabled:opacity-50 disabled:cursor-default",
          "focus-within-indicator rounded-sm"
        )}
        onClick={handleResend}
      >
        {t("resendButton")}
        {isDisabled ? (
          <span
            className={cn("inline-block", "absolute left-[calc(100%+4px)]")}
          >{`(${resendTime}s)`}</span>
        ) : null}
      </button>
    </div>
  );
}
