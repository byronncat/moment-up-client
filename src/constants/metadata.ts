import type { Metadata as NextMetadata } from "next";

export interface MetadataMap {
  root: NextMetadata;

  // === Auth ===
  login: NextMetadata;
  signup: NextMetadata;
  forgotPassword: NextMetadata;

  // === Public ===
  explore: NextMetadata;
  search: NextMetadata;
  profile: (username: string) => NextMetadata;
  notifications: NextMetadata;
  moment: (username: string, content?: string) => NextMetadata;
  story: NextMetadata;

  // === Private ===
  messages: NextMetadata;

  // === Error ===
  notFound: NextMetadata;
}

export const Metadata: MetadataMap = {
  root: {
    title: {
      template: "%s | MomentUp",
      default: "MomentUp",
    },
    description:
      "A platform for creating, sharing, and discovering engaging moments.",
  },

  // === Auth ===
  login: {
    title: "Login",
    description: "Sign in to your account and join the world.",
  },
  signup: {
    title: "Sign Up",
    description: "Create your account and start connecting today.",
  },
  forgotPassword: {
    title: "Recover",
    description: "Find your account and reset your password.",
  },

  // === Public ===
  profile: (username: string) => {
    return {
      title: `@${username}`,
      description: `See posts, stories and profile details from @${username} on MomentUp.`,
    };
  },

  explore: {
    title: "Explore",
    description: "Explore page",
  },
  search: {
    title: "Search",
    description: "Search page",
  },
  notifications: {
    title: "Notifications",
    description: "Notifications page",
  },
  moment: (username: string, content?: string) => {
    return {
      title: `@${username}${content ? ` | ${content}` : ""}`,
      description: `Moment page of ${username}${content ? ` | ${content}` : ""}`,
    };
  },
  story: {
    title: "Story",
    description: "Story page",
  },

  // === Private ===
  messages: {
    title: "Messages",
    description: "View and communicate with your friends",
  },

  // === Error ===
  notFound: {
    title: "Page Not Found",
    description: "Sorry, we couldn't find the page you're looking for.",
  },
};
