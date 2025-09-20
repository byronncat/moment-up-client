import type { API, CommentInfo, ErrorDto, FeedItemDto } from "api";
import type { ContentPrivacy } from "@/constants/server";

import type { Token } from "@/components/providers/Auth";
import { ApiUrl } from "./api.constant";
import { parseErrorMessage } from "./helper";

interface CreatePostDto {
  text?: string | null;
  privacy?: ContentPrivacy | null;
  attachments?: Array<{ id: string; type: "image" | "video" | "raw" }> | null;
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
        message: "Post created successfully",
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
  momentId: string;
  shouldLike: boolean;
}

export async function like(data: LikeDto, token: Token): API {
  const endpoint = data.shouldLike
    ? ApiUrl.post.like(data.momentId)
    : ApiUrl.post.unlike(data.momentId);
  const method = data.shouldLike ? "POST" : "DELETE";
  const successMessage = data.shouldLike ? "Liked" : "Unliked";

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
  momentId: string;
  shouldBookmark: boolean;
}

export async function bookmark(data: BookmarkDto, token: Token): API {
  const endpoint = data.shouldBookmark
    ? ApiUrl.post.bookmark(data.momentId)
    : ApiUrl.post.unbookmark(data.momentId);
  const method = data.shouldBookmark ? "POST" : "DELETE";
  const successMessage = data.shouldBookmark ? "Bookmarked" : "Unbookmarked";

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

export async function report(_momentId: string) {
  return {
    success: true,
    message: "ok",
    statusCode: 200,
  };
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
