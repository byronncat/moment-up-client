import { MAX_TEXT_CONTENT_LENGTH } from "@/constants/server";

import { cn } from "@/libraries/utils";
import { Textarea as TextareaUI } from "@/components/ui/textarea";

type TextareaProps = Readonly<{
  text: string;
  setText: (text: string) => void;
  className?: string;
}>;

export default function Textarea({ text, setText, className }: TextareaProps) {
  return (
    <TextareaUI
      id="text-content"
      className={cn("block resize-none scrollbar-track-hidden", className)}
      placeholder="What's on your mind?"
      maxLength={MAX_TEXT_CONTENT_LENGTH}
      value={text}
      onChange={(event) => setText(event.target.value)}
    />
  );
}
