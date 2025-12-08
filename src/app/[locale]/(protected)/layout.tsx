import {
  CloudinaryProvider,
  KeyProvider,
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
      <KeyProvider>
        <PostProvider>
          <StoryProvider>
            {children}
            {modal}
          </StoryProvider>
        </PostProvider>
      </KeyProvider>
    </CloudinaryProvider>
  );
}
