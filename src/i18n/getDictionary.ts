import type { Locale } from './config';

// 서버 컴포넌트에서 사용하는 dictionary 로더
const dictionaries = {
  ko: () => import('./dictionaries/ko.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ja: () => import('./dictionaries/ja.json').then((module) => module.default),
  zh: () => import('./dictionaries/zh.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default),
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
