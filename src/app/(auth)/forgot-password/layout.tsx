import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.forgotPassword;

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
