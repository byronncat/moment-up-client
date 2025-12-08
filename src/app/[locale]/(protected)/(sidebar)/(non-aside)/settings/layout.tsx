import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.settings;

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
