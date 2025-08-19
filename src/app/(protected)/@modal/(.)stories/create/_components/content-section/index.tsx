import { useCreateData } from "../../_provider";
import TypeSelector from "./TypeSelector";
import Preview from "./Preview";

export default function ContentSection() {
  const { type } = useCreateData();

  return (
    <div className="grow h-full bg-background-dark">
      {type === null ? <TypeSelector /> : <Preview />}
    </div>
  );
}
