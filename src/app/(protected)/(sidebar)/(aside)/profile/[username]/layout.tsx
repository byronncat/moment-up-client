import { Metadata } from "@/constants/metadata";
export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ username: string }> }>) {
  const { username } = await params;
  return Metadata.profile(username);
}

import { use } from "react";
import ProfileProvider from "./_providers/ProfileProvider";

export default function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>) {
  const { username } = use(params);
  return (
    <ProfileProvider username={username}>
      <main className="size-full">{children}</main>
    </ProfileProvider>
  );
}
