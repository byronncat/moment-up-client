import {
  CloudinaryProvider,
  MomentStorageProvider,
  StoryStorageProvider,
} from "@/components/providers";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>;

export default function Layout({ children, modal }: LayoutProps) {
  return (
    <CloudinaryProvider>
      <MomentStorageProvider>
        <StoryStorageProvider>
          {children}
          {modal}
        </StoryStorageProvider>
      </MomentStorageProvider>
    </CloudinaryProvider>
  );
}
