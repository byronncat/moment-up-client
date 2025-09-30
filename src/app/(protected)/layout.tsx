import {
  CloudinaryProvider,
  PostProvider,
  StoryProvider,
} from "@/components/providers";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>;

export default function Layout({ children, modal }: LayoutProps) {
  return (
    <CloudinaryProvider>
      <PostProvider>
        <StoryProvider>
          {children}
          {modal}
        </StoryProvider>
      </PostProvider>
    </CloudinaryProvider>
  );
}
