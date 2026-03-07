'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { Dictionary } from './getDictionary';
import type { Locale } from './config';

type TranslationContextType = {
  dictionary: Dictionary;
  locale: Locale;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({
  children,
  dictionary,
  locale,
}: {
  children: ReactNode;
  dictionary: Dictionary;
  locale: Locale;
}) {
  return (
    <TranslationContext.Provider value={{ dictionary, locale }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

// 중첩된 키로 dictionary 값을 가져오는 헬퍼 함수
export function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // 키를 찾지 못하면 경로 자체를 반환
    }
  }

  return typeof current === 'string' ? current : path;
}

// 편의를 위한 t 함수를 반환하는 훅
export function useT() {
  const { dictionary } = useTranslation();

  return (key: string): string => {
    return getNestedValue(dictionary as unknown as Record<string, unknown>, key);
  };
}
