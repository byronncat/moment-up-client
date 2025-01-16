import clsx from "clsx";

type DividerProps = Readonly<{
  text?: string;
  className?: string;
}>;

export default function Divider({ text, className }: DividerProps) {
  return (
    <div
      className={clsx(
        "flex items-center",
        "cursor-default",
        className,
        text
          ? "before:flex-1 before:border-t before:me-4 after:flex-1 after:border-t after:ms-4"
          : "before:flex-1 before:border-t",
        "text-accent/[.6]",
        "before:border-accent/[.2] after:border-accent/[.2]"
      )}
    >
      {text}
    </div>
  );
}
