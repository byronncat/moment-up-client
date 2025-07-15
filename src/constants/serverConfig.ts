export const SERVER_HOST_URL =
  process.env.NEXT_PUBLIC_SERVER_HOST || "http://localhost:4000";

export enum ReportType {
  NOT_RELEVANT = 0,
  SPAM = 1,
  ABUSIVE = 2,
  NOT_INTERESTED = 3,
  DUPLICATE = 4,
  HARMFUL = 5,
}
