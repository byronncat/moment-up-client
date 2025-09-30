import type { API, CommentInfo, ErrorDto, FeedItemDto } from "api";
import type { PublicId, ResourceType } from "cloudinary";
import type { Token } from "@/components/providers/Auth";
import type { ContentPrivacy, ContentReportType } from "@/constants/server";

import { ApiUrl } from "./api.constant";
import { parseErrorMessage } from "./helper";

const SuccessMessage = {
  createPost: "Post created",
  toggleLike: (isLiked: boolean) => (isLiked ? "Liked" : "Unliked"),
  toggleBookmark: (shouldBookmark: boolean) =>
    shouldBookmark ? "Bookmarked" : "Unbookmarked",
  reportPost: "Reported successfully",
  repost: "Reposted successfully",
  deleteStory: "Story deleted successfully",
  getMoment: "Moment fetched successfully",
  addComment: "Comment added successfully",
};

interface CreatePostDto {
  text?: string | null;
  privacy?: ContentPrivacy | null;
  attachments?: Array<{ id: PublicId; type: ResourceType }> | null;
}

export async function create(data: CreatePostDto, token: Token): API {
  return fetch(ApiUrl.post.create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: SuccessMessage.createPost,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

interface LikeDto {
  postId: string;
  shouldLike: boolean;
}

export async function likePost(data: LikeDto, token: Token): API {
  const endpoint = data.shouldLike
    ? ApiUrl.post.like(data.postId)
    : ApiUrl.post.unlike(data.postId);
  const method = data.shouldLike ? "POST" : "DELETE";
  const successMessage = SuccessMessage.toggleLike(data.shouldLike);

  return fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: successMessage,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

interface BookmarkDto {
  postId: string;
  shouldBookmark: boolean;
}

export async function bookmarkPost(data: BookmarkDto, token: Token): API {
  const endpoint = data.shouldBookmark
    ? ApiUrl.post.bookmark(data.postId)
    : ApiUrl.post.unbookmark(data.postId);
  const method = data.shouldBookmark ? "POST" : "DELETE";
  const successMessage = SuccessMessage.toggleBookmark(data.shouldBookmark);

  return fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: successMessage,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function reportPost(
  postId: string,
  data: { type: ContentReportType },
  token: Token
): API {
  return fetch(ApiUrl.post.report(postId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: SuccessMessage.reportPost,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

// +++ TODO: Need to change momentId to postId +++
export async function repost(
  data: {
    momentId: string;
    text: string;
    audience: ContentPrivacy;
  },
  token: Token
): API {
  return fetch(ApiUrl.post.repost(data.momentId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({
      text: data.text,
      audience: data.audience,
    }),
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Reposted successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function deleteStory(storyId: string, token: Token): API {
  return fetch(ApiUrl.story.delete(storyId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Story deleted successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function getMoment(momentId: string): API<FeedItemDto | null> {
  return fetch(ApiUrl.post.getById(momentId), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Moment fetched successfully",
        data: (await response.json()).moment,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

interface CommentDto {
  content: string;
  momentId: string;
}

export async function addComment(
  data: CommentDto,
  token: Token
): API<CommentInfo | null> {
  return fetch(ApiUrl.comment.add, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Comment added successfully",
        data: (await response.json()).comment,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function deleteComment(commentId: string, token: Token): API {
  return fetch(ApiUrl.comment.delete(commentId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Comment deleted successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function likeComment(
  commentId: string,
  isLiked: boolean,
  token: Token
): API {
  return fetch(ApiUrl.comment[isLiked ? "like" : "unlike"](commentId), {
    method: isLiked ? "POST" : "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: isLiked
          ? "Comment liked successfully"
          : "Comment unliked successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}
