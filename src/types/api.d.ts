declare module "api" {
  import type { SearchItemType } from "@/constants/serverConfig";
  import type { StoryBackground } from "@/constants/serverConfig";

  type API<T = void> = Promise<{
    success: boolean;
    message: string;
    statusCode: number;
    data?: T;
  }>;

  interface ErrorResponse {
    error: string;
    message: string | string[];
    statusCode: number;
  }

  interface PaginationInfo<T> {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    items: T[];
  }

  // === User ===
  interface AccountInfo {
    id: string;
    email: string;
    username: string;
    displayName: string | null;
    avatar: string | null;
  }

  interface ProfileInfo extends AccountInfo {
    bio?: string;
    backgroundImage?: string;
    followers: number;
    following: number;
    hasStory: boolean;
    isFollowing?: boolean;
  }

  interface UserCardDisplayInfo extends Omit<ProfileInfo, "backgroundImage"> {
    followedBy?: {
      count: number;
      displayItems: {
        id: string;
        displayName: string;
        avatar: AccountInfo["avatar"];
      }[];
    };
  }

  // === Moment ===
  type PostInfo = {
    text?: string;
    files?: {
      id: string;
      type: "image" | "video" | "audio";
      url: string;
      aspectRatio: "1:1" | "9:16" | "4:5" | "1.91:1";
    }[];
    createdAt: string;
    likes: number;
    comments: number;
    reposts: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };

  type MomentInfo = {
    id: string;
    user: UserCardDisplayInfo;
    post: PostInfo;
  };

  type CommentInfo = {
    id: string;
    user: UserCardDisplayInfo;
    content: string;
    likes: number;
    isLiked: boolean;
    updatedAt: string;
  };

  // === Story ===
  type StoryNotificationInfo = {
    id: string;
    userId: string;
    username: string;
    displayName: string;
    avatar: AccountInfo["avatar"];
    viewed: boolean;
    total: number;
    createdAt: string;
  };

  type StoryContent =
    | { type: "text"; text: string; background: StoryBackground }
    | {
        id: string;
        type: "image" | "video";
        url: string;
        aspectRatio: "9:16";
      };

  type StoryInfo = {
    user: Omit<AccountInfo, "email">;
    stories: {
      id: string;
      content: StoryContent;
      sound?: string;
      createdAt: string;
    }[];
  };

  // === Notification ===
  type SecurityNotification = {
    id: string;
    type: "security";
    userId: string;
    createdAt: string;
  };

  type CommunityNotification = {
    id: string;
    type: "social";
    user: UserCardDisplayInfo;
    createdAt: string;
    information:
      | {
          type: "post" | "mention";
          content: string;
        }
      | {
          type: "follow";
        };
  };

  type NotificationInfo = SecurityNotification | CommunityNotification;

  // === Search ===
  interface UserSearchItem extends AccountInfo {
    type: SearchItemType.USER;
  }

  interface QuerySearchItem {
    type: SearchItemType.QUERY;
    id: string;
  }

  interface HashtagSearchItem extends Hashtag {
    type: SearchItemType.HASHTAG;
  }

  interface PostSearchItem extends MomentInfo {
    type: SearchItemType.POST;
  }

  interface MediaSearchItem extends MomentInfo {
    type: SearchItemType.MEDIA;
  }

  type SearchItem =
    | UserSearchItem
    | QuerySearchItem
    | HashtagSearchItem
    | PostSearchItem
    | MediaSearchItem;

  type PopularProfileItem = Omit<
    ProfileInfo,
    "followers" | "following" | "hasStory" | "isFollowing"
  >;

  // === Others ===
  type Hashtag = {
    id: string;
    count: number;
  };

  type FileInfo = {
    id: string;
    type: "image" | "video" | "audio";
    url: string;
    aspectRatio: "1:1" | "9:16" | "4:5" | "1.91:1";
  };
}
