type NavItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
  matchPath: (pathname: string) => boolean;
};

export type { NavItem };
