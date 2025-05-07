import type { Metadata as NextMetadata } from "next";

type MetadataMap = {
  [key: string]: NextMetadata;
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
    description: "Create a new account",
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
};
