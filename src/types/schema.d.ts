declare module "schema" {
  type User = {
    readonly id: uuidv4;
    username: string;
    display_name: string;
    email: string;
    password_hash?: string;
    bio?: string;
    avatar?: string;
    background_image?: string;
    verified: boolean;
    readonly created_at: Date;
  };

  type HashtagItem = {
    readonly id: string;
    count: number;
  };

  type Feed = {
    readonly id: string;
    readonly user_id: User["id"];
    content: File | string;
    sound?: File;
    readonly created_at: Date;
  };

  type FeedView = {
    readonly id: string;
    readonly feed_id: Feed["id"];
    readonly user_id: User["id"];
    readonly created_at: Date;
  };

  type Moment = {
    readonly id: string;
    readonly user_id: User["id"];
    text?: string;
    files?: File[];
    readonly created_at: Date;
  };

  type MomentLike = {
    readonly id: string;
    readonly moment_id: Moment["id"];
    readonly user_id: User["id"];
    readonly created_at: Date;
  };

  type Comment = {
    readonly id: string;
    readonly moment_id: Moment["id"];
    readonly user_id: User["id"];
    content: string;
    readonly created_at: Date;
  };

  type Notification = {
    readonly id: string;
    readonly user_id: User["id"];
    readonly created_at: Date;
    type: "community" | "security" | "system";
  };

  type File = {
    readonly id: string;
    readonly type: "image" | "video" | "audio";
    readonly url: string;
  };
}
