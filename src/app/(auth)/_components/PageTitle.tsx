import clsx from "clsx";

type PageTitleProps = Readonly<{
  title: string;
}>;

export default function PageTitle({ title }: PageTitleProps) {
  return (
    <h2
      className={clsx(
        "text-center mb-6",
        "font-source-code-pro font-bold text-4xl",
        "cursor-default"
      )}
    >
      {title}
    </h2>
  );
}
