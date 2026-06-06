import { ReactNode } from 'react';

export interface Minister {
  name: string;
  role: string;
}

export interface MinistryDictionary {
  title: string;
  ministers: Minister[];
}

export interface QuickMenuDictionary {
  counseling: string;
  testimonies: string;
  falseClaims: string;
  exitMethods: string;
  recruitmentTactics: string;
  locations: string;
}

export interface QuickMenuItem {
  icon: ReactNode;
  labelKey: keyof QuickMenuDictionary;
  href: string;
}

export interface BoardItem {
  id: string;
  title: string;
  author: string;
  date: string;
  visibilityLevel?: string;
}

export interface TestimonyItem {
  id: string;
  title: string;
  image: string;
  date: string;
}

export interface NewsItem {
  title: string;
  image: string;
  source: string;
  date: string;
  href: string;
}

export interface SideNavDictionary {
  counseling: string;
  exitMethods: string;
  testimonies: string;
  falseClaims: string;
  donation: string;
}
