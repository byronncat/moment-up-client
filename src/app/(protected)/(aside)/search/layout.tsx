import { Metadata } from "@/constants/metadata";
import { ListLayout } from "../_components";

export const metadata = Metadata.search;
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ListLayout>{children}</ListLayout>;
}
