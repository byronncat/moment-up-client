declare type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

declare type ComponentProps<BaseProps = Record<string, unknown>> = Readonly<
  BaseProps & {
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
  }
>;
