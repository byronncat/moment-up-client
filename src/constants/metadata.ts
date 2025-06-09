import type { Metadata as NextMetadata } from "next";

export type MetadataMap = {
  root: NextMetadata;
  login: NextMetadata;
  signup: NextMetadata;
  recover: NextMetadata;
  verify: NextMetadata;
  home: NextMetadata;
  explore: NextMetadata;
  search: NextMetadata;
  profile: (username: string) => NextMetadata;
  notifications: NextMetadata;
};

export const Metadata: MetadataMap = {
  root: {
    title: {
      template: "%s | MomentUp",
      default: "MomentUp",
    },
    description:
      "A platform for creating, sharing, and discovering engaging moments.",
  },
  login: {
    title: "Login",
    description: "Login to your account",
  },
  signup: {
    title: "Sign Up",
    description:
      "Create a new account - Username must be at least 2 characters with only letters, numbers, dots, underscores, and hyphens. Password must be at least 8 characters and include 3 of: uppercase, lowercase, numbers.",
  },
  recover: {
    title: "Recover Password",
    description: "Recover your password",
  },
  verify: {
    title: "Verify Recovery Code",
    description: "Verify your recovery code",
  },
  home: {
    title: "Home",
    description: "Home page",
  },
  explore: {
    title: "Explore",
    description: "Explore page",
  },
  search: {
    title: "Search",
    description: "Search page",
  },
  profile: (username: string) => {
    return {
      title: `@${username}`,
      description: `Profile page of ${username}`,
    };
  },
  notifications: {
    title: "Notifications",
    description: "Notifications page",
  },
};
