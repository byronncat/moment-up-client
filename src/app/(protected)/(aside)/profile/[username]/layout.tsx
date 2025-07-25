import { Metadata, type MetadataMap } from "@/constants/metadata";
import { Suspense, use } from "react";
import { UserApi } from "@/services";
import ProfileProvider from "./_providers/ProfileProvider";
import { ProfileZoneSkeleton } from "./_components";

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ username: string }> }>) {
  const username = (await params).username;
  return (Metadata.profile as MetadataMap["profile"])(username);
}

export default function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>) {
  const { username } = use(params);
  const profileApi = UserApi.getProfile(username);
  console.log(username);
  return (
    <Suspense fallback={<ProfileZoneSkeleton />}>
      <ProfileProvider username={username} api={profileApi}>
        {children}
      </ProfileProvider>
    </Suspense>
  );
}
