import type { SearchResult } from "api";
import { SearchCategory } from "@/constants/clientConfig";
import { SearchItemType } from "@/constants/serverConfig";

import { cn } from "@/libraries/utils";
import { SearchItem } from "../../_components";
import { ErrorContent } from "@/components/common";
import {
  //  MomentCard,
  MomentCell,
} from "@/components/moment";
import LoadingIndicator from "./LoadingIndicator";

type SearchResultsProps = Readonly<{
  results: SearchResult | null;
  type: SearchCategory;
  loading: boolean;
  onError: () => void;
}>;

const ItemStyles = cn(
  "flex items-center justify-between",
  "group",
  "px-4 py-2",
  "cursor-pointer hover:bg-accent/[.05]"
);

function UserList({ users }: { users: SearchResult["users"] }) {
  if (!users?.length) return null;
  return (
    <div className="space-y-1 pb-10">
      {users.map((user) => (
        <div key={user.id} className={ItemStyles}>
          <SearchItem data={{ ...user, type: SearchItemType.USER }} />
        </div>
      ))}
    </div>
  );
}

function HashtagList({ hashtags }: { hashtags: SearchResult["hashtags"] }) {
  if (!hashtags?.length) return null;
  return (
    <div className="space-y-1 pb-10">
      {hashtags.map((hashtag) => (
        <div key={hashtag.id} className={ItemStyles}>
          <SearchItem data={{ ...hashtag, type: SearchItemType.HASHTAG }} />
        </div>
      ))}
    </div>
  );
}

function PostList({ posts }: { posts: SearchResult["posts"] }) {
  if (!posts?.length) return null;
  return (
    <div className="space-y-4 px-4 pt-4 pb-10">
      {/* {posts.map((post) => (
        <MomentCard key={post.id} data={post} />
      ))} */}
    </div>
  );
}

function MediaGrid({ posts }: { posts: SearchResult["posts"] }) {
  if (!posts?.length) return null;
  return (
    <div className={cn("grid grid-cols-3", "gap-1 px-1 pt-1 pb-10")}>
      {posts.map((post) => (
        <MomentCell key={post.id} data={post} />
      ))}
    </div>
  );
}

function Header({ title }: Readonly<{ title: string }>) {
  return (
    <div className={cn("flex justify-between items-center", "mb-2 px-4")}>
      <h2 className="font-semibold">{title}</h2>
    </div>
  );
}

function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="mt-[calc(44px+1px)]">{children}</div>;
}

function CategoryResults({
  type,
  results,
}: Readonly<{ type: SearchCategory; results: SearchResult }>) {
  const { users, posts, hashtags } = results;

  switch (type) {
    case SearchCategory.PEOPLE:
      return <UserList users={users} />;
    case SearchCategory.HASHTAG:
      return <HashtagList hashtags={hashtags} />;
    case SearchCategory.POSTS:
      return <PostList posts={posts} />;
    case SearchCategory.MEDIA:
      return <MediaGrid posts={posts} />;
    default:
      return (
        <div className="space-y-4">
          <div>
            <Header title="People" />
            <UserList users={users} />
          </div>
          <div>
            <Header title="Trending" />
            <HashtagList hashtags={hashtags} />
          </div>
          <div>
            <Header title="Posts" />
            <PostList posts={posts} />
          </div>
        </div>
      );
  }
}

export default function SearchResults({
  results,
  type,
  loading,
  onError,
}: SearchResultsProps) {
  if (loading)
    return (
      <Wrapper>
        <LoadingIndicator />
      </Wrapper>
    );

  if (results === null)
    return <ErrorContent onRefresh={onError} className="h-fit py-6" />;

  return (
    <Wrapper>
      <CategoryResults type={type} results={results} />
    </Wrapper>
  );
}
