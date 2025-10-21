import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Chevron } from "@/components/icons";

type NavigateButtonsProps = {
  onNavigate: (direction: "prev" | "next") => void;
};

export default function NavigateButtons({ onNavigate }: NavigateButtonsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <>
      <button
        className={cn(
          "absolute left-0 top-0",
          "h-full w-1/2",
          "cursor-pointer"
        )}
        onClick={() => onNavigate("prev")}
      />
      <button
        className={cn(
          "absolute right-0 top-0",
          "h-full w-1/2",
          "cursor-pointer"
        )}
        onClick={() => onNavigate("next")}
      />
    </>
  ) : (
    <>
      <Button
        variant="ghost"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -left-12",
          "size-10 rounded-full",
          "bg-foreground-dark/10 hover:bg-accent-dark/20",
          "text-foreground-dark hover:text-accent-foreground-dark"
        )}
        onClick={() => onNavigate("prev")}
      >
        <Chevron direction="left" className="size-6 mr-1" />
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -right-12",
          "size-10 rounded-full",
          "bg-foreground-dark/10 hover:bg-accent-dark/20",
          "text-foreground-dark hover:text-accent-foreground-dark"
        )}
        onClick={() => onNavigate("next")}
      >
        <Chevron direction="right" className="size-6 ml-1" />
      </Button>
    </>
  );
}
