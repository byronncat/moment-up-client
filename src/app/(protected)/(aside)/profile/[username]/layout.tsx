import { Metadata, type MetadataMap } from "@/constants/metadata";

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ username: string }> }>) {
  const username = (await params).username;
  return (Metadata.profile as MetadataMap["profile"])(username);
}

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
