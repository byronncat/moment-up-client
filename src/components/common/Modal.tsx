"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/libraries/utils";
import { FocusTrap } from "focus-trap-react";

export default function Modal({
  children,
  onClose,
  disableFocusTrap,
  className,
}: Readonly<{
  children: React.ReactNode;
  onClose?: () => void;
  disableFocusTrap?: boolean;
  className?: string;
}>) {
  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    if (event.target !== event.currentTarget) return;
    onClose?.();
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const content = (
    <div
      data-modal-container
      className={cn(
        "fixed top-0 left-0 z-50",
        "h-dvh w-screen",
        "flex items-center justify-center",
        "bg-black/50",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );

  return createPortal(
    disableFocusTrap ? content : <FocusTrap>{content}</FocusTrap>,
    document.body
  );
}
