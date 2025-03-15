import { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
  order?: number;
  requireAuth?: boolean;
  dropdownItems?: NavItem[];
  hideMobile?: boolean;
  hideDesktop?: boolean;
}

export interface NavLogo {
  title: string;
  path: string;
  imageSrc: string;
}

export interface NavConfig {
  logo: NavLogo;
  items: NavItem[];
} 