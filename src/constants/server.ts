export const SERVER_HOST_URL =
  process.env.NEXT_PUBLIC_SERVER_HOST ?? "http://localhost:4000";

export const INITIAL_PAGE = 1;

export const MAX_NAME_LENGTH = 50;
export const MAX_BIO_LENGTH = 160;
export const MAX_TEXT_CONTENT_LENGTH = 2000;
export const MIN_USERNAME_LENGTH = 5;
export const MIN_PASSWORD_LENGTH = 7;

export enum ContentPrivacy {
  PUBLIC,
  FOLLOWERS,
  PRIVATE,
}

export enum UserReportType {
  SPAM,
  IMPERSONATION,
  INAPPROPRIATE_CONTENT,
  ABUSIVE,
  HARMFUL,
  CHILD_EXPLORATION,
  SEXUAL_CONTENT,
  FAKE_INFORMATION,
  DONT_WANT_TO_SEE,
  OTHER,
}

export enum ContentReportType {
  SPAM,
  INAPPROPRIATE_CONTENT,
  ABUSIVE,
  HARMFUL,
  SEXUAL_CONTENT,
  CHILD_EXPLOITATION,
  COPYRIGHT_VIOLATION,
  VIOLENCE,
  FAKE_INFORMATION,
  OTHER,
}

export const CONTENT_REPORT_OPTIONS = [
  { label: "Spam", value: ContentReportType.SPAM },
  {
    label: "Inappropriate content",
    value: ContentReportType.INAPPROPRIATE_CONTENT,
  },
  { label: "Abusive", value: ContentReportType.ABUSIVE },
  { label: "Harmful", value: ContentReportType.HARMFUL },
  { label: "Sexual content", value: ContentReportType.SEXUAL_CONTENT },
  { label: "Child exploitation", value: ContentReportType.CHILD_EXPLOITATION },
  {
    label: "Copyright violation",
    value: ContentReportType.COPYRIGHT_VIOLATION,
  },
  { label: "Violence", value: ContentReportType.VIOLENCE },
  { label: "Fake information", value: ContentReportType.FAKE_INFORMATION },
  { label: "Other", value: ContentReportType.OTHER },
] as const;

export enum TrendingReportType {
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
  POST,
  MEDIA,
}

export enum StoryFontFamily {
  ROBOTO,
  YESTERYEAR,
  SOURCE_CODE_PRO,
  MERRIWEATHER,
}

export enum StoryBackground {
  BLUE_GRADIENT,
  PINK_PURPLE_BLUE_GRADIENT,
  MAGENTA_ORANGE_YELLOW_GRADIENT,
  DOWNY,
  MANDY,
  PERSIAN_BLUE,
  SOLID_BLACK,

  PURPLE_WAVY_LINE,
  PINK_TOPOGRAPHY,
  GRAY_STAIRS,
  RED_ZIG_ZAG,
  LIGHT_GRAY_WEAVE,
  STARRY_NIGHT,
  CARBON,

  ARGYLE,
  GRAY_CUBE,
  TARTAN,
  TEAL_CICADA_STRIPES,
  BLACKBERRY_ENDLESS_CONSTELLATION,
  ORANG_FLAT_MOUNTAINS,
  GREEN_HOLLOWED_BOXES,

  GREEN_TORTOISE_SHELL,
  TEAL_ROTATED_SQUARES,
  YELLOW_LIQUID_CHEESE,
  FLAMINGO_PROTRUDING_SQUARES,
  PURPLE_TO_PINK_SUBTLE_PRISM,
  SPECTRUM_GRADIENT,
  BLACK_WAVEY_FINGERPRINT,

  RADIENT_GRADIENT,
  ORANGE_SUN_TORNADO,
}

export enum NotificationFilter {
  FOLLOW_REQUEST = "follow_request",
}

export enum NotificationType {
  FOLLOW_REQUEST,
}

export enum ExploreType {
  MEDIA = "media",
  POST = "posts",
}

export enum ErrorCode {
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
}
