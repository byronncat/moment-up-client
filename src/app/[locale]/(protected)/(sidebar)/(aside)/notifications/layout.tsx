import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.notifications;

import { cn } from "@/libraries/utils";
import NotificationStorageProvider from "../../../../../../components/providers/NotificationStorage";
import { PageHeader } from "../_components";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <PageHeader
        title="Notifications"
        className={cn(
          "w-full",
          "sticky top-0 left-0 z-10",
          "border-b border-border"
        )}
      />
      <main className="size-full">
        <NotificationStorageProvider>{children}</NotificationStorageProvider>
      </main>
    </div>
  );
}
