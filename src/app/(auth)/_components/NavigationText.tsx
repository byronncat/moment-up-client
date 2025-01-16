import Link from "next/link";
import clsx from "clsx";

type NavigationTextProps = Readonly<{
  text?: string;
  path: string;
  hyperlink: string;
  className: string;
}>;

export default function NavigationText({
  text,
  path,
  hyperlink,
  className,
}: NavigationTextProps) {
  return (
    <p className={clsx(className, "text-sm")}>
      {text && `${text} `}
      <Link
        href={path}
        className={clsx(
          "text-primary",
          "font-semibold",
          "hover:opacity-60 transition-opacity duration-150 ease-in-out"
        )}
      >
        {hyperlink}
      </Link>
    </p>
  );
}
