import { MomentDataProvider } from "@/components/providers";
import FeedDataProvider from "./@modal/(.)feeds/[username]/[id]/hooks/useFeedData";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>;

export default function Layout({ children, modal }: LayoutProps) {
  return (
    <MomentDataProvider>
      <FeedDataProvider>
        {children}
        {modal}
      </FeedDataProvider>
    </MomentDataProvider>
  );
}
