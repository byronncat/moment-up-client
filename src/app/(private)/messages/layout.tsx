import { ChatSidebar } from "./_components";
import ContactProvider from "./_provider/Contact";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ContactProvider>
      <div className="flex h-screen w-full">
        <ChatSidebar />
        <div className="grow">{children}</div>
      </div>
    </ContactProvider>
  );
}
