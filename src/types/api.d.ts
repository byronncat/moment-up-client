declare module "api" {
  import type { Moment, User } from "schema";
  type MomentUI = Moment &
    Pick<User, "username" | "profile_picture"> & {
      likes: number;
      comments: number;
      isLiked: boolean;
    };
}
