export const buttonTransition = "transition-colors duration-150 ease-in-out";

export const hoverOpacity =
  "hover:opacity-80 transition-opacity duration-150 ease-in-out";

export const flexCenter = "flex justify-center items-center";

export const truncateText = (maxWidth: string) => `truncate ${maxWidth}`;

export const conditionalClass = (
  condition: boolean,
  trueClass: string,
  falseClass = ""
) => (condition ? trueClass : falseClass);

export const themeColors = {
  primary: "text-primary",
  muted: "text-muted-foreground",
  destructive: "text-destructive",
} as const;

export const sizes = {
  icon: {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
    xl: "size-8",
  },
  text: {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  },
} as const;
