import { ContentPrivacy } from "@/constants/server";
import { Earth, Lock, User } from "@/components/icons";

export type PrivacyOption = {
  label: string;
  value: ContentPrivacy;
  icon: React.ReactNode;
  description: string;
};

export const PRIVACY_OPTIONS: PrivacyOption[] = [
  {
    label: "Public",
    value: ContentPrivacy.PUBLIC,
    icon: <Earth className="size-4" />,
    description: "Anyone can see this",
  },
  {
    label: "Followers",
    value: ContentPrivacy.FOLLOWERS,
    icon: <User variant="check" className="size-4" />,
    description: "People who follow you",
  },
  {
    label: "Private",
    value: ContentPrivacy.PRIVATE,
    icon: <Lock className="size-4" />,
    description: "Only you can see this",
  },
];
