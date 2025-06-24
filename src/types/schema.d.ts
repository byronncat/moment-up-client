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

  type Moment = {
    readonly id: string;
    readonly user_id: User["id"];
    text?: string;
    files?: File[];
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
    type: "social" | "system";
  };

  type File = {
    readonly id: string;
    readonly type: "image" | "video" | "audio";
    readonly url: string;
    readonly aspect_ratio: "1:1" | "9:16" | "4:5" | "1.91:1";
  };

  type Hashtag = {
    readonly id: string;
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
}
