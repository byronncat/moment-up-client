import { MomentDataProvider } from "@/components/providers";
import StoryDataProvider from "./@modal/(.)stories/[username]/[id]/hooks/useStoryData";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>;

export default function Layout({ children, modal }: LayoutProps) {
  return (
    <MomentDataProvider>
      <StoryDataProvider>
        {children}
        {modal}
      </StoryDataProvider>
    </MomentDataProvider>
  );
}
