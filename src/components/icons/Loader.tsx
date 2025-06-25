import { Loader2 } from "lucide-react";

type LoaderProps = Readonly<{
  className?: string;
}>;

export default function Loader({ className }: LoaderProps) {
  return <Loader2 className={className} />;
}
