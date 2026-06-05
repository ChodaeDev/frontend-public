export const locales = ['ko', 'en', 'ja', 'zh', 'de'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ko';

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
  de: 'Deutsch',
};

export const localeFlags: Record<Locale, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  ja: '🇯🇵',
  zh: '🇨🇳',
  de: '🇩🇪',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
