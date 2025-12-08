import { ProfileLayout } from "../_components";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ProfileLayout>{children}</ProfileLayout>;
}
