import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.story;

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
