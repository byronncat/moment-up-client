import { use } from "react";
import { UserApi } from "@/services";
import Client from "./_components/Client";
import { notFound } from "next/navigation";

type ProfileMomentsProps = Readonly<{
  params: Promise<{ username: string }>;
}>;

export default function ProfileMomentsPage({ params }: ProfileMomentsProps) {
  const username = use(params).username;
  const profilRes = use(UserApi.getProfile(username));
  const momentsRes = UserApi.getMoments("moments", username, 0);

  if (!profilRes.success) notFound();
  return (
    <Client
      username={username}
      profile={profilRes.data!}
      initialRes={momentsRes}
    />
  );
}
