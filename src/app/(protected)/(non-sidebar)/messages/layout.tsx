import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.messages;

import { cn } from "@/libraries/utils";
import { ChatSidebar } from "./_components";
import ContactProvider from "./_provider/Contact";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ContactProvider>
      <_beta className="w-full" />
      <div className="flex size-full">
        <ChatSidebar className="w-full mobile:w-[320px]" />
        <div className="grow mobile:block hidden">{children}</div>
      </div>
    </ContactProvider>
  );
}

function _beta({ className }: Readonly<{ className?: string }>) {
  return (
    <p
      className={cn(
        className,
        "py-1 backdrop-blur-md",
        "text-center text-sm text-muted-foreground italic",
        "border-b border-border"
      )}
    >
      This is a beta feature. Please wait for the official release.
    </p>
  );
}
