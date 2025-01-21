import Image from "next/image";
import clsx from "clsx";
import { ModeToggle, Brand } from "@/components";
import backgroundImg from "@/assets/imgs/night-neon.avif";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={clsx("w-screen h-screen", "flex")}>
      <AsideBackground />
      <main
        className={clsx("size-full lg:max-w-screen-md", "shrink-0", "relative")}
      >
        <div
          className={clsx(
            "flex justify-between items-center",
            "h-14 px-3",
            "absolute top-0 left-0 right-0"
          )}
        >
          <Brand className="h-9" />
          <ModeToggle />
        </div>
        <div className={clsx("h-full", "flex justify-center items-center")}>
          {children}
        </div>
      </main>
    </div>
  );
}

function AsideBackground() {
  return (
    <div
      className={clsx(
        "size-full",
        "relative",
        "grow",
        "hidden lg:block",
        "select-none"
      )}
    >
      <Image
        src={backgroundImg.src}
        alt="background"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-center object-cover"
        placeholder="blur"
        blurDataURL={backgroundImg.blurDataURL}
      />
      <div
        className={clsx(
          "size-full px-6",
          "absolute top-0 left-0",
          "flex flex-col justify-center items-center",
          "text-center",
          "backdrop-blur-sm",
          "bg-[linear-gradient(45deg,rgba(4,2,96,0.5),rgba(180,49,183,0.9)),linear-gradient(90deg,rgba(51,136,140,0.3),rgba(87,240,240,0.1))]"
        )}
      >
        <div className="w-full">
          <h1
            className={clsx(
              "mb-3",
              "font-monoton text-3xl tracking-widest",
              "animation-glowing"
            )}
            style={{
              "--glowing-color": "#ff1177",
            }}
          >
            welcome back
          </h1>
          <p
            className={clsx(
              "glowing",
              "font-abel text-lg font-medium tracking"
            )}
            style={{
              "--glowing-color": "#ff1177",
            }}
          >
            The ultimate platform designed to bring people together through the
            power of media.
          </p>
        </div>
      </div>
    </div>
  );
}
