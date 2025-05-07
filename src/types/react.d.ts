declare type ComponentProps<BaseProps = Record<string, unknown>> = Readonly<
  BaseProps & {
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
  }
>;
