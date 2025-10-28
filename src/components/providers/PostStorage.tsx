"use client";

// === Type ===
import type { FeedItemDto } from "api";
import type { ContentPrivacy, ContentReportType } from "@/constants/server";

type PostsState = Map<string, FeedItemDto> | undefined;

type UpdatePostPayload = {
  text: string;
  privacy: ContentPrivacy;
};

type PostsAction =
  | { type: "CLEAR_POSTS" }
  | { type: "SET_POSTS"; payload: FeedItemDto[] }
  | { type: "ADD_POSTS"; payload: FeedItemDto[] }
  | {
      type: "UPDATE_POST";
      payload: { postId: string; text: string; privacy: ContentPrivacy };
    }
  | { type: "REMOVE_POST"; payload: string }
  | { type: "TOGGLE_LIKE"; payload: string }
  | { type: "TOGGLE_BOOKMARK"; payload: string }
  | { type: "TOGGLE_FOLLOW"; payload: string }
  | {
      type: "UPDATE_COMMENT_COUNT";
      payload: { postId: string; mode: "increase" | "decrease" };
    };

type PostContextType = {
  posts: FeedItemDto[] | undefined;
  setPosts: (posts: FeedItemDto[] | undefined) => void;
  addPosts: (posts: FeedItemDto[]) => void;
  updatePost: (
    postId: string,
    payload: { text: string; privacy: ContentPrivacy }
  ) => void;
  deletePost: (postId: string) => void;
  setCurrentPost: (postId: string | null) => void;
  getCurrentPost: () => FeedItemDto | undefined;

  actionKey: RefObject<number>;
  incrementActionKey: () => void;

  like: (postId: string) => Promise<void>;
  bookmark: (postId: string) => Promise<void>;
  share: (postId: string) => void;
  report: (postId: string, type: ContentReportType) => void;
  follow: (postId: string) => Promise<void>;
  updateCommentCount: (postId: string, mode: "increase" | "decrease") => void;
};

// === Provider ===
import {
  type RefObject,
  createContext,
  use,
  useCallback,
  useReducer,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { CoreApi, UserApi } from "@/services";
import { Link } from "@/components/icons";
import { useRefreshApi } from "./hooks/useRefreshApi";

const initialPostsState: PostsState = undefined;

function postsReducer(state: PostsState, action: PostsAction): PostsState {
  switch (action.type) {
    case "CLEAR_POSTS": {
      return undefined;
    }

    case "SET_POSTS": {
      const newMap = new Map<string, FeedItemDto>();
      action.payload.forEach((post) => {
        newMap.set(post.id, post);
      });
      return newMap;
    }

    case "ADD_POSTS": {
      if (action.payload.length > 0) {
        const newMap = new Map(state);
        action.payload.forEach((post) => {
          newMap.set(post.id, post);
        });
        return newMap;
      }
      return state;
    }

    case "UPDATE_POST": {
      if (!state) return state;
      const newMap = new Map(state);
      const post = newMap.get(action.payload.postId);
      if (post) {
        newMap.set(action.payload.postId, {
          ...post,
          post: {
            ...post.post,
            text: action.payload.text,
            privacy: action.payload.privacy,
          },
        });
      }
      return newMap;
    }

    case "TOGGLE_LIKE": {
      if (!state) return state;
      const newMap = new Map(state);
      const feed = newMap.get(action.payload);
      if (feed) {
        newMap.set(action.payload, {
          ...feed,
          post: {
            ...feed.post,
            isLiked: !feed.post.isLiked,
            likes: feed.post.isLiked
              ? feed.post.likes - 1
              : feed.post.likes + 1,
          },
        });
      }
      return newMap;
    }

    case "TOGGLE_BOOKMARK": {
      if (!state) return state;
      const newMap = new Map(state);
      const feed = newMap.get(action.payload);
      if (feed) {
        newMap.set(action.payload, {
          ...feed,
          post: {
            ...feed.post,
            isBookmarked: !feed.post.isBookmarked,
          },
        });
      }
      return newMap;
    }

    case "TOGGLE_FOLLOW": {
      if (!state) return state;
      const newMap = new Map(state);
      const feed = newMap.get(action.payload);
      if (feed) {
        newMap.set(action.payload, {
          ...feed,
          user: {
            ...feed.user,
            isFollowing: !feed.user.isFollowing,
          },
        });
      }
      return newMap;
    }

    case "UPDATE_COMMENT_COUNT": {
      if (!state) return state;
      const newMap = new Map(state);
      const feed = newMap.get(action.payload.postId);
      if (feed) {
        const increment = action.payload.mode === "increase" ? 1 : -1;
        newMap.set(action.payload.postId, {
          ...feed,
          post: {
            ...feed.post,
            comments: Math.max(0, feed.post.comments + increment),
          },
        });
      }
      return newMap;
    }

    default:
      return state;
  }
}

export type Actions = {
  delete: (postId: FeedItemDto["id"]) => void;
  like: (postId: FeedItemDto["id"]) => Promise<void>;
  bookmark: (postId: FeedItemDto["id"]) => Promise<void>;
  share: (postId: FeedItemDto["id"]) => void;
  report: (postId: FeedItemDto["id"], type: ContentReportType) => void;
  follow: (postId: FeedItemDto["id"]) => Promise<void>;
};

const MomentDataContext = createContext<PostContextType>({
  posts: undefined,
  setPosts: () => {},
  addPosts: () => {},
  updatePost: () => {},
  deletePost: () => {},
  setCurrentPost: () => {},
  getCurrentPost: () => undefined,

  actionKey: { current: 0 },
  incrementActionKey: () => {},

  like: async () => {},
  bookmark: async () => {},
  share: () => {},
  report: () => {},
  follow: async () => {},
  updateCommentCount: async () => {},
});

export const usePost = () => use(MomentDataContext);

type MomentDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MomentDataProvider({
  children,
}: MomentDataProviderProps) {
  const [posts, dispatch] = useReducer(postsReducer, initialPostsState);
  const [currentPost, setCurrentPost] = useState<string | null>(null);
  const actionKey = useRef(0);

  const likeApi = useRefreshApi(CoreApi.likePost);
  const bookmarkApi = useRefreshApi(CoreApi.bookmarkPost);
  const reportApi = useRefreshApi(CoreApi.reportPost);
  const followApi = useRefreshApi(UserApi.follow);
  const deleteApi = useRefreshApi(CoreApi.deletePost);

  const getCurrentPost = useCallback(() => {
    if (!posts) return undefined;
    return currentPost ? posts.get(currentPost) : posts.values().next().value;
  }, [posts, currentPost]);

  const setPosts = useCallback((payload: FeedItemDto[] | undefined) => {
    if (payload) dispatch({ type: "SET_POSTS", payload });
    else dispatch({ type: "CLEAR_POSTS" });
  }, []);

  const addPosts = useCallback((moments: FeedItemDto[]) => {
    dispatch({ type: "ADD_POSTS", payload: moments });
  }, []);

  const removePost = useCallback((postId: string) => {
    actionKey.current++;
    dispatch({ type: "REMOVE_POST", payload: postId });
  }, []);

  const updatePost = useCallback(
    (postId: string, payload: UpdatePostPayload) => {
      actionKey.current++;
      dispatch({ type: "UPDATE_POST", payload: { postId, ...payload } });
    },
    []
  );

  const deletePost = useCallback(
    (postId: string) => {
      toast.promise(deleteApi(postId), {
        loading: "Deleting post...",
        success: ({ success, message }) => {
          if (success) {
            removePost(postId);
            return "The post has been deleted.";
          }
          throw new Error(message);
        },
        error: ({ message }) => message,
      });
    },
    [deleteApi, removePost]
  );

  const like = useCallback(
    async (postId: string) => {
      const post = posts?.get(postId);
      if (!post) return;

      const shouldLike = !post.post.isLiked;
      dispatch({ type: "TOGGLE_LIKE", payload: postId });

      const { success, message } = await likeApi({
        postId,
        shouldLike,
      });

      if (success) actionKey.current++;
      else {
        dispatch({ type: "TOGGLE_LIKE", payload: postId });
        toast.error(message || "Failed to like moment");
      }
    },
    [posts, likeApi]
  );

  const bookmark = useCallback(
    async (postId: string) => {
      const moment = posts?.get(postId);
      if (!moment) return;

      const shouldBookmark = !moment.post.isBookmarked;
      dispatch({ type: "TOGGLE_BOOKMARK", payload: postId });

      const { success, message } = await bookmarkApi({
        postId,
        shouldBookmark,
      });

      if (success) actionKey.current++;
      else {
        dispatch({ type: "TOGGLE_BOOKMARK", payload: postId });
        toast.error(message || "Failed to bookmark moment");
      }
    },
    [posts, bookmarkApi]
  );

  const follow = useCallback(
    async (postId: string) => {
      const moment = posts?.get(postId);
      if (!moment) return;

      const shouldFollow = !moment.user.isFollowing;
      dispatch({ type: "TOGGLE_FOLLOW", payload: postId });

      const { success, message } = await followApi({
        targetId: moment.user.id,
        shouldFollow,
      });

      if (success) actionKey.current++;
      else {
        dispatch({ type: "TOGGLE_FOLLOW", payload: postId });
        toast.error(message || "Failed to follow/unfollow user");
      }
    },
    [posts, followApi]
  );

  const share = useCallback((postId: string) => {
    const url = window.location.href;
    const { origin } = new URL(url);
    navigator.clipboard.writeText(`${origin}/moment/${postId}`);
    toast(
      <div className="flex items-center gap-2">
        <Link size={16} />
        <p>Copied to clipboard</p>
      </div>
    );
  }, []);

  const report = useCallback(
    (postId: string, type: ContentReportType) => {
      toast.promise(reportApi(postId, { type }), {
        loading: "Reporting...",
        success: ({ success, message }) => {
          if (success) return "Reported";
          throw new Error(message);
        },
        error: ({ message }) => message,
      });
    },
    [reportApi]
  );

  const updateCommentCount = useCallback(
    (postId: string, mode: "increase" | "decrease") => {
      dispatch({ type: "UPDATE_COMMENT_COUNT", payload: { postId, mode } });
    },
    []
  );

  return (
    <MomentDataContext.Provider
      value={{
        posts: posts ? Array.from(posts.values()) : undefined,
        setPosts,
        addPosts,
        updatePost,
        deletePost,
        getCurrentPost,
        setCurrentPost,

        actionKey,
        incrementActionKey: () => {
          actionKey.current++;
        },

        like,
        bookmark,
        share,
        report,
        follow,
        updateCommentCount,
      }}
    >
      {children}
    </MomentDataContext.Provider>
  );
}
