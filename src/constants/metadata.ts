import type { Metadata as NextMetadata } from "next";

export interface MetadataMap {
  root: NextMetadata;

  // === Auth ===
  login: NextMetadata;
  signup: NextMetadata;
  forgotPassword: NextMetadata;

  // === Public ===
  explore: NextMetadata;
  profile: (username: string) => NextMetadata;
  post: (username: string, content: string | null) => NextMetadata;

  // === Private ===
  archive: NextMetadata;
  messages: NextMetadata;

  // === Error ===
  notFound: NextMetadata;

  // +++ TODO: Ongoing +++
  story: NextMetadata;
  search: NextMetadata;
  notifications: NextMetadata;
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
  explore: {
    title: "Explore",
    description: "The latest stories, trends, and topics in one place.",
  },
  profile: (username: string) => {
    return {
      title: `@${username}`,
      description: `See posts, stories and profile details from @${username} on MomentUp.`,
    };
  },
  post: (username: string, content: string | null) => {
    return {
      title: content ? `${content} • @${username}` : `@${username}`,
      description: content
        ? `${username} posted: ${content}`
        : `See posts and updates from @${username}`,
    };
  },

  // === Private ===
  archive: {
    title: "Archive",
    description:
      "View your complete archive: all posts, media, and interactions.",
  },

  // === Error ===
  notFound: {
    title: "Page Not Found",
    description: "Sorry, we couldn't find the page you're looking for.",
  },

  // +++ TODO: Ongoing +++

  search: {
    title: "Search",
    description: "Search page",
  },
  notifications: {
    title: "Notifications",
    description: "Notifications page",
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
};
