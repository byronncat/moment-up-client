import { cn } from "@/libraries/utils";
import Sidebar from "./_components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className={cn("w-screen min-h-screen", "relative")}>
        <div className="min-h-full flex">
          <Sidebar>
            <div className="flex-1">
              {children}
            </div>
          </Sidebar>
        </div>
      </div>
    </SidebarProvider>
  );
}
