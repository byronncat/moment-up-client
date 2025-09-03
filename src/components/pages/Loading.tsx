import { cn } from "@/libraries/utils";
import Brand from "../common/Brand";
import styles from "@/styles/loader.module.css";

export default function LoadingPage({
  message = "LOADING...",
  showBrand = true,
}: Readonly<{
  message?: string;
  showBrand?: boolean;
}>) {
  return (
    <div
      className={cn("flex items-center justify-center", "h-svh")}
      role="status"
      aria-label="Loading content"
    >
      <Loader message={message} />
      {showBrand ? <BottomBrand className="absolute bottom-6" /> : null}
    </div>
  );
}

function Loader({ message }: Readonly<{ message: string }>) {
  return (
    <div className="flex flex-col justify-center items-center">
      <BoxRotate />
      <TextWave message={message} className="mt-8 sm:mt-12" />
    </div>
  );
}

function BoxRotate() {
  return (
    <div>
      <div
        className={cn(
          styles["configure-border-1"],
          "size-20 sm:size-24 p-0.5",
          "absolute flex justify-center items-center"
        )}
      >
        <span
          className={cn(styles["configure-core"], "size-full bg-background")}
        />
      </div>
      <div
        className={cn(
          styles["configure-border-2"],
          "flex justify-center items-center",
          "size-20 sm:size-24 p-0.5"
        )}
      >
        <span
          className={cn(
            styles["configure-core"],
            `dark:${styles["configure-core"]}`,
            "size-full bg-background"
          )}
        />
      </div>
    </div>
  );
}

function TextWave({
  message,
  className,
}: Readonly<{
  message: string;
  className?: string;
}>) {
  const letters = message.split("");

  return (
    <div
      className={cn(
        styles.waviy,
        "text-primary",
        "px-4 py-1 rounded",
        "font-bold text-xl sm:text-2xl tracking-widest",
        className
      )}
      aria-hidden="true"
    >
      {letters.map((letter, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={index}>{letter}</span>
      ))}
    </div>
  );
}

function BottomBrand({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <span className="text-muted-foreground text-sm font-medium">From</span>
      <Brand hyperlink={false} className="h-7" />
    </div>
  );
}
