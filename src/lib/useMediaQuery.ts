'use client';

import { useState, useEffect } from 'react';

/**
 * 미디어 쿼리 매칭 여부를 반환하는 훅
 * @param query - CSS 미디어 쿼리 문자열 (예: '(min-width: 1024px)')
 * @returns 미디어 쿼리 매칭 여부
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

/**
 * lg 브레이크포인트(1024px) 이상인지 확인하는 훅
 * @returns lg 이상이면 true, 미만이면 false
 */
export const useIsLgScreen = (): boolean => {
  return useMediaQuery('(min-width: 1024px)');
};
