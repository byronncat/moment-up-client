import { use } from "react";
import { UserApi } from "@/services";
import { MomentList } from "../_components";

type ProfileMomentsProps = Readonly<{
  params: Promise<{ username: string }>;
}>;

export default function ProfileMomentsPage({ params }: ProfileMomentsProps) {
  const username = use(params).username;
  const momentsRes = UserApi.getMoments("moments", username, 0);
  return <MomentList username={username} initialRes={momentsRes} />;
}
