import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/icons";
import Container from "../Container";

export default function LoadingState({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <Container className={className}>
      <Skeleton className="size-full flex items-center justify-center bg-card-dark">
        <Loader className="size-10 animate-spin text-foreground-dark" />
      </Skeleton>
    </Container>
  );
}
