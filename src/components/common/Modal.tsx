import { cn } from "@/libraries/utils";

type ModalProps = Readonly<{
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}>;

export default function Modal({ children, onClose, className }: ModalProps) {
  return (
    <div
      className={cn(
        "top-0 right-0 absolute z-30",
        "size-full",
        "bg-black/80",
        className
      )}
      onClick={onClose}
    >
      {children}
    </div>
  );
}
