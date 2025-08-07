type NavItem = {
  title: string;
  url: string;
  icon: (open: boolean) => React.ReactNode;
  matchPath?: () => boolean;
};

export type { NavItem };
