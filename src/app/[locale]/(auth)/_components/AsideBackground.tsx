import { useTranslations } from "next-intl";
import { cn } from "@/libraries/utils";
import Image from "next/image";

export default function AsideBackground({
  className,
}: Readonly<{
  className?: string;
}>) {
  const t = useTranslations("AuthAside");

  return (
    <div className={cn("relative select-none", className)}>
      <Image
        src="/color_background.jpeg"
        alt="Neon synthwave background"
        fill
        sizes="70vw"
        className="object-center object-cover"
      />
      <div
        className={cn(
          "size-full px-6",
          "absolute top-0 left-0",
          "flex flex-col justify-center items-center",
          "text-center",
          "bg-[linear-gradient(45deg,rgba(4,2,96,0.5),rgba(180,49,183,0.9)),linear-gradient(90deg,rgba(51,136,140,0.3),rgba(87,240,240,0.1))]"
        )}
      >
        <div className="w-full">
          <h1
            className={cn(
              "mb-3",
              "font-monoton text-3xl tracking-widest",
              "animation-glowing"
            )}
            style={
              {
                "--glowing-color": "#ff1177",
              } as React.CSSProperties
            }
          >
            {t("welcomeTitle")}
          </h1>
          <p
            className={cn("glowing", "font-abel text-lg font-medium tracking")}
            style={
              {
                "--glowing-color": "#ff1177",
              } as React.CSSProperties
            }
          >
            {t("welcomeDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}
