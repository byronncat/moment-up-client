export const SERVER_HOST_URL =
  process.env.NEXT_PUBLIC_SERVER_HOST || "http://localhost:4000";

export const INITIAL_PAGE = 1;

export enum Audience {
  PUBLIC,
  FOLLOWERS,
  FRIENDS,
  VERIFIED,
  ONLY_ME,
}

export enum ReportType {
  NOT_RELEVANT,
  SPAM,
  ABUSIVE,
  NOT_INTERESTED,
  DUPLICATE,
  HARMFUL,
}

export enum SearchItemType {
  USER,
  QUERY,
  HASHTAG,
  POST,
}
