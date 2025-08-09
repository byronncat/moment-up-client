import { mockComments, mockMoments } from "@/__mocks__";
import type { MomentInfo, CommentInfo } from "api";
import { SortBy } from "@/constants/clientConfig";
import { Audience } from "@/constants/serverConfig";

import type { Token } from "@/components/providers/Auth";
import type { API, ErrorResponse } from "api";
import { ApiUrl } from "./api.constant";

const apiRes = {
  getMoment: "success" as "error" | "empty" | "success",
  getComments: "success" as "error" | "success" | "empty",
  comment: "success" as "error" | "success",
  report: "success" as "error" | "success",
  toggleCommentLike: "success" as "error" | "success",
};

interface LikeDto {
  momentId: string;
  shouldLike: boolean;
}

interface BookmarkDto {
  momentId: string;
  shouldBookmark: boolean;
}

export async function like(data: LikeDto, token: Token): API {
  const endpoint = data.shouldLike
    ? ApiUrl.moment.like(data.momentId)
    : ApiUrl.moment.unlike(data.momentId);
  const method = data.shouldLike ? "POST" : "DELETE";
  const successMessage = data.shouldLike ? "Liked" : "Unliked";

  return await fetch(endpoint, {
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
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: error.message as string,
        statusCode: error.statusCode,
      };
    });
}

export async function bookmark(data: BookmarkDto, token: Token): API {
  const endpoint = data.shouldBookmark
    ? ApiUrl.moment.bookmark(data.momentId)
    : ApiUrl.moment.unbookmark(data.momentId);
  const method = data.shouldBookmark ? "POST" : "DELETE";
  const successMessage = data.shouldBookmark ? "Bookmarked" : "Unbookmarked";

  return await fetch(endpoint, {
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
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: error.message as string,
        statusCode: error.statusCode,
      };
    });
}

export async function repost(
  data: {
    momentId: string;
    text: string;
    audience: Audience;
  },
  token: Token
): API {
  return await fetch(ApiUrl.moment.repost(data.momentId), {
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
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: error.message as string,
        statusCode: error.statusCode,
      };
    });
}

export async function deleteStory(storyId: string, token: Token): API {
  return await fetch(ApiUrl.story.delete(storyId), {
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
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: error.message as string,
        statusCode: error.statusCode,
      };
    });
}

export async function getMoment(momentId: string): API<MomentInfo | null> {
  console.log("getMoment", momentId);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (apiRes.getMoment === "error") {
    return {
      success: false,
      message: "Something went wrong",
      data: undefined,
      statusCode: 500,
    };
  }
  if (apiRes.getMoment === "empty") {
    return {
      success: false,
      message: "Moment not found",
      data: null,
      statusCode: 404,
    };
  }
  return {
    success: true,
    message: "ok",
    data: mockMoments.find((moment) => moment.id === momentId),
    statusCode: 200,
  };
}

export async function getComments(
  momentId: string,
  page: number,
  sortBy: SortBy
): API<{
  items: CommentInfo[];
  hasNextPage: boolean;
}> {
  console.log("getComments", momentId, page, sortBy);
  const comments = mockComments.sort((a, b) => {
    if (sortBy === SortBy.NEWEST) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.likes - a.likes;
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (apiRes.getComments === "empty") {
    return {
      success: true,
      message: "ok",
      statusCode: 200,
      data: {
        items: [],
        hasNextPage: false,
      },
    };
  }

  if (apiRes.getComments === "error") {
    return {
      success: false,
      message: "error",
      statusCode: 500,
    };
  }

  return {
    success: true,
    message: "ok",
    statusCode: 200,
    data: {
      items: comments.map((comment) => ({
        ...comment,
        id: `${comment.id}-${page}`,
      })),
      hasNextPage: page <= 3,
    },
  };
}

export async function comment(momentId: string, data: CommentInfo): API {
  console.log("comment", momentId, data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (apiRes.comment === "error") {
    return {
      success: false,
      message: "error",
      statusCode: 500,
    };
  }

  return {
    success: true,
    message: "ok",
    statusCode: 200,
  };
}

export async function report(momentId: string) {
  console.log("Report feature is not implemented yet", momentId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (apiRes.report === "error") {
    return {
      success: false,
      message: "error",
      statusCode: 500,
    };
  }

  return {
    success: true,
    message: "ok",
    statusCode: 200,
  };
}

export async function toggleCommentLike(commentId: string): API {
  console.log("Comment like feature is not implemented yet", commentId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (apiRes.toggleCommentLike === "error") {
    return {
      success: false,
      message: "error",
      statusCode: 500,
    };
  }

  return {
    success: true,
    message: "ok",
    statusCode: 200,
  };
}
