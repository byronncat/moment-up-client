import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.explore;

import Header from "./_components/Header";

export default function ExploreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header title="Explore" />
      <main className="flex-1">{children}</main>
    </>
  );
}
