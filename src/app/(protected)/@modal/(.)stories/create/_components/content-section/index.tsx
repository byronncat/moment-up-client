import { useCreateData } from "../../_providers";

import { cn } from "@/libraries/utils";
import TypeSelector from "./TypeSelector";
import Preview from "./Preview";

export default function ContentSection({
  className,
}: Readonly<{ className?: string }>) {
  const { type } = useCreateData();

  return (
    <div className={cn("bg-background-dark", className)}>
      {type === null ? <TypeSelector /> : <Preview />}
    </div>
  );
}
