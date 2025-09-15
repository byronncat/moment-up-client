declare module "api" {
  import type { SearchItemType, StoryBackground } from "@/constants/server";

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
  interface AccountDto {
    id: string;
    username: string;
    displayName: string | null;
    avatar: string | null;
  }

  interface ProfileDto extends AccountDto {
    bio: string | null;
    backgroundImage: string | null;
    followers: number;
    following: number;
    isFollowing: boolean | null;
    isMuted: boolean | null;
    isProtected: boolean;
    hasStory: boolean;
  }

  interface UserSummaryDto
    extends Omit<ProfileDto, "backgroundImage" | "isProtected"> {
    followedBy: {
      count: number;
      displayItems: Array<{
        id: string;
        displayName: string;
        avatar: AccountDto["avatar"];
      }>;
    } | null;
  }

  // === Moment ===
  type PostInfo = {
    text?: string;
    files?: Array<{
      id: string;
      type: "image" | "video" | "audio";
      url: string;
      aspectRatio: "1:1" | "9:16" | "4:5" | "1.91:1";
    }>;
    createdAt: string;
    likes: number;
    comments: number;
    reposts: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };

  type MomentInfo = {
    id: string;
    user: UserSummaryDto;
    post: PostInfo;
  };

  type CommentInfo = {
    id: string;
    user: UserSummaryDto;
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
    avatar: AccountDto["avatar"];
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
    user: Omit<AccountDto, "email">;
    stories: Array<{
      id: string;
      content: StoryContent;
      sound?: string;
      createdAt: string;
    }>;
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
    user: UserSummaryDto;
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
  interface UserSearchItem extends AccountDto {
    type: SearchItemType.USER;
  }

  interface QuerySearchItem {
    type: SearchItemType.QUERY;
    id: string;
  }

  interface HashtagSearchItem extends HashtagDto {
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
    ProfileDto,
    "followers" | "following" | "hasStory" | "isFollowing"
  >;

  // === Others ===
  type HashtagDto = {
    name: string;
    count: number;
  };

  type FileInfo = {
    id: string;
    type: "image" | "video" | "audio";
    url: string;
    aspectRatio: "1:1" | "9:16" | "4:5" | "1.91:1";
  };
}
