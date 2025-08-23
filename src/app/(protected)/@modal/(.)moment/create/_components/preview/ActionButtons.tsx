import { Format } from "@/utilities";
import { cn } from "@/libraries/utils";
import { Heart, Message, Share, Repeat, Bookmark } from "@/components/icons";

const buttonStyles = "size-5";

export default function ActionButtons() {
  const buttons = [
    {
      id: "like",
      icon: (
        <Heart type="solid" className={cn(buttonStyles, "fill-pink-500")} />
      ),
      count: 1000,
      textColor: "text-pink-500",
    },
    {
      id: "comment",
      icon: (
        <Message
          className={cn(
            buttonStyles,
            "fill-muted-foreground",
            "translate-x-[1px]"
          )}
        />
      ),
      count: 1000,
    },
    {
      id: "repost",
      icon: <Repeat className={cn(buttonStyles, "fill-muted-foreground")} />,
      count: 1000,
    },
    {
      id: "bookmark",
      icon: (
        <Bookmark
          type="solid"
          className={cn(buttonStyles, "fill-yellow-500")}
        />
      ),
    },
    {
      id: "share",
      icon: <Share className={cn(buttonStyles, "fill-muted-foreground")} />,
    },
  ];

  return (
    <>
      <div className={cn("px-4 py-3")}>
        <div
          className={cn(
            "flex items-center justify-between",
            "w-full",
            "text-muted-foreground"
          )}
        >
          {buttons.slice(0, 3).map((button) => (
            <IconButton key={button.id} {...button} />
          ))}

          <div className="flex items-center gap-1">
            {buttons.slice(3).map((button) => (
              <IconButton key={button.id} {...button} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

type IconButtonProps = {
  icon: React.ReactNode;
  textColor?: string;
  count?: number;
};

function IconButton({ icon, textColor, count }: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "group flex items-center gap-1",
        "cursor-pointer",
        textColor
      )}
    >
      <div className={cn("p-2 rounded-full")}>{icon}</div>
      {count !== undefined && <span>{Format.number(count)}</span>}
    </button>
  );
}
