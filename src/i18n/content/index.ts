import { use } from 'react';
import type { Locale } from '@/i18n/config';

/**
 * 긴 본문(탈퇴 방법, 신천지인들에게, 신천지 이력)은 사전(dictionary)에서 분리해 따로 둔다.
 * 사전은 모든 페이지에 통째로 내려가므로, 긴 본문은 해당 페이지에서 해당 언어 파일만 불러온다.
 */
const loaders = {
  methods: {
    ko: () => import('./ko/methods.json'),
    en: () => import('./en/methods.json'),
    ja: () => import('./ja/methods.json'),
    zh: () => import('./zh/methods.json'),
    de: () => import('./de/methods.json'),
  },
  toMembers: {
    ko: () => import('./ko/toMembers.json'),
    en: () => import('./en/toMembers.json'),
    ja: () => import('./ja/toMembers.json'),
    zh: () => import('./zh/toMembers.json'),
    de: () => import('./de/toMembers.json'),
  },
  history: {
    ko: () => import('./ko/history.json'),
    en: () => import('./en/history.json'),
    ja: () => import('./ja/history.json'),
    zh: () => import('./zh/history.json'),
    de: () => import('./de/history.json'),
  },
} satisfies Record<string, Record<Locale, ()=> Promise<{ default: unknown }>>>;

export type PageContentName = keyof typeof loaders;

// use()는 같은 Promise를 다시 받아야 하므로 이름·언어별로 캐시한다
const cache = new Map<string, Promise<unknown>>();

function loadPageContent(name: PageContentName, locale: Locale): Promise<unknown> {
  const key = `${ name }:${ locale }`;
  let promise = cache.get(key);
  if (!promise) {
    promise = loaders[name][locale]().then((module) => module.default);
    cache.set(key, promise);
  }
  return promise;
}

/** 긴 본문 JSON을 읽는다. 상위에 Suspense가 있어야 하며 서버 렌더링에도 포함된다. */
export function usePageContent<T>(name: PageContentName, locale: Locale): T {
  return use(loadPageContent(name, locale)) as T;
}
