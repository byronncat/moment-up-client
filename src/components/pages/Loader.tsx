import { cn } from "@/lib/utils";
import styles from "@/styles/loader.module.css";

function BoxSpin({ className }: ComponentProps) {
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
            "size-24 p-0.5"
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
          "text-primary",
          "px-4 py-1 mt-12 rounded",
          "font-bold text-2xl tracking-widest"
        )}
      >
        <span>L</span>
        <span>O</span>
        <span>A</span>
        <span>D</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
    </div>
  );
}

const Loader = {
  BoxSpin,
};

export default Loader;
