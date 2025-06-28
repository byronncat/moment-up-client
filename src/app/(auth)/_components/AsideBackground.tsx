import { cn } from "@/libraries/utils";
import Image from "next/image";
import backgroundImg from "@/assets/imgs/night-neon.avif";

type AsideBackgroundProps = Readonly<{
  className?: string;
}>;

export default function AsideBackground({ className }: AsideBackgroundProps) {
  return (
    <div className={cn("relative select-none", className)}>
      <Image
        src={backgroundImg.src}
        alt="background"
        fill
        sizes="70vw"
        className="object-center object-cover"
        placeholder="blur"
        blurDataURL={backgroundImg.blurDataURL}
      />
      <div
        className={cn(
          "size-full px-6",
          "absolute top-0 left-0",
          "flex flex-col justify-center items-center",
          "text-center",
          "backdrop-blur-xs",
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
            welcome back
          </h1>
          <p
            className={cn("glowing", "font-abel text-lg font-medium tracking")}
            style={
              {
                "--glowing-color": "#ff1177",
              } as React.CSSProperties
            }
          >
            The ultimate platform designed to bring people together through the
            power of media.
          </p>
        </div>
      </div>
    </div>
  );
}
