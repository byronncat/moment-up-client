import { cn } from "@/lib/utils";
import styles from "@/styles/loader.module.css";

type LoaderProps = {
  className?: string;
};

function BoxSpin({ className }: LoaderProps) {
  return (
    <div className={cn("flex flex-col justify-center items-center", className)}>
      <div>
        <div
          className={cn(
            styles["configure-border-1"],
            "size-24 p-0.5",
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
            "size-24 p-0.5",
            "rotate-45"
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
      <div
        className={cn(
          styles.waviy,
          "text-white",
          "px-4 py-1 mt-16 rounded",
          "font-bold text-xl tracking-widest",
          "bg-primary"
        )}
      >
        <span>L</span>
        <span>O</span>
        <span>A</span>
        <span>D</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
      </div>
    </div>
  );
}

// TODO: Implement a regular spinner
function Regular() {
  return (
    <div
      className={cn(
        "size-10",
        "rounded-full animate-spin",
        "border-4 border-solid border-t-transparent dark:border-t-transparent",
        "border-primary dark:border-dark-primary"
      )}
    />
  );
}

const Loader = {
  BoxSpin,
  Regular,
};

export default Loader;
