export interface NavItem {
  id: string;
  label: string;
  path: string;
  requiredAuth?: boolean;
  roles?: string[];
  icon?: React.ReactNode;
  children?: NavItem[];
  isActive?: (pathname: string) => boolean;
  dropdownItems?: NavItem[];
}

export interface NavConfig {
  items: NavItem[];
  logo: {
    path: string;
    title: string;
    imageSrc: string;
  };
} 