"use client";

import { useProfile } from "../_providers/Profile";
import { ROUTE } from "@/constants/route";

import { type NavItem, NavigationBar } from "@/components/common";
import { ProfileLayout } from "../_components";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { profile } = useProfile();
  const tabs: NavItem[] = [
    {
      id: "following",
      label: "Following",
      href: ROUTE.PROFILE(profile.username, "following"),
    },
    {
      id: "followers",
      label: "Followers",
      href: ROUTE.PROFILE(profile.username, "followers"),
    },
  ];

  return (
    <ProfileLayout tabs={<NavigationBar items={tabs} />}>
      {children}
    </ProfileLayout>
  );
}
