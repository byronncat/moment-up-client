"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

import BubbleTextarea from "@/components/BubbleTextarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ArrowLeft } from "@/components/icons";
import { ROUTE } from "@/constants/clientConfig";

export default function ThoughtPage() {
  return (
    <div
      className={cn(
        "flex flex-col",
        "h-full relative",
        "border-r border-border"
      )}
    >
      <Header />
      <Content />
      <ShareButton />
    </div>
  );
}

function Header() {
  const router = useRouter();
  function handleBack() {
    router.push(ROUTE.MESSAGES);
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "pt-7 px-4 pb-4",
        "border-b border-border"
      )}
    >
      <h1 className="text-2xl font-bold">New</h1>
      <button
        className={cn(
          "size-8 rounded-full",
          "flex items-center justify-center",
          "cursor-pointer hover:bg-accent/[0.12]",
          "transition-colors duration-150 ease-in-out"
        )}
        onClick={handleBack}
      >
        <ArrowLeft className="size-5 fill-muted-foreground" />
      </button>
    </div>
  );
}

function Content() {
  const [thought, setThought] = useState("");
  const maxCharacterLimit = 60;
  const isButtonDisabled = thought.trim().length === 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="max-w-[20rem] w-full">
        <BubbleTextarea
          value={thought}
          onChange={setThought}
          placeholder="Share a thought..."
          maxLength={maxCharacterLimit}
        />
      </div>

      <div className="flex justify-center -mt-3">
        <Avatar className="size-24">
          <AvatarImage
            src="https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large"
            alt="Profile"
            className="object-cover"
          />
          <AvatarFallback>PM</AvatarFallback>
        </Avatar>
      </div>

      <button
        type="submit"
        disabled={isButtonDisabled}
        className={cn(
          "px-5 py-2 mt-2",
          "font-semibold",
          "text-primary",
          "hover:text-primary/80",
          "transition-colors duration-150 ease-in-out"
        )}
      >
        Share
      </button>
    </div>
  );
}

function ShareButton() {
  const [isOpenShare, setIsOpenShare] = useState(false);

  return (
    <div className="p-4 border-t border-zinc-800 flex items-center justify-center">
      <button
        className="flex items-center gap-1 text-sm font-medium text-white py-2 px-4"
        onClick={() => setIsOpenShare(!isOpenShare)}
      >
        {/* <ArrowUpRight className="w-4 h-4" /> */}
        Shared with followers you follow back
        <ChevronDown className={cn("w-4 h-4", isOpenShare && "rotate-180")} />
      </button>
    </div>
  );
}
