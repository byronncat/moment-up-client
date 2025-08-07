import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.feed;

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
