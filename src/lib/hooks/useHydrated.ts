'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * 클라이언트 하이드레이션이 끝났는지 여부.
 * 로그인 정보(zustand persist)는 localStorage에서 바로 읽혀서 서버 렌더와 첫 클라이언트 렌더가 달라진다.
 * 로그인 여부로 화면이 갈리는 곳에서 이 값이 true가 된 뒤에만 user를 쓴다.
 */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
