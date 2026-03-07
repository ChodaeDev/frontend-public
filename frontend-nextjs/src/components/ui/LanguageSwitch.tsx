'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Dropdown,
  DropdownList,
  DropdownItem,
  DropdownTrigger,
} from '@/components/ui/Dropdown';
import { Globe, Dot } from 'lucide-react';
import { useIsLgScreen } from '@/lib/useMediaQuery';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { useTranslation } from '@/i18n/client';

const LanguageSwitch = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isLgScreen = useIsLgScreen();
  const { locale: currentLocale, dictionary } = useTranslation();

  const switchLocale = (newLocale: Locale) => {
    // 현재 경로에서 locale 부분만 교체
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    // 쿠키 설정
    document.cookie = `next_locale=${ newLocale };path=/;max-age=${ 60 * 60 * 24 * 365 }`;

    router.push(newPath);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <div
          className={'flex rounded-md p-2 hover:bg-background-secondary cursor-pointer'}
          aria-label={dictionary.language.select}
        >
          <Globe className={'size-4 text-main'} />
        </div>
      </DropdownTrigger>
      <DropdownList align={'end'} direction={isLgScreen ? 'bottom' : 'left'}>
        {locales.map((locale) => (
          <DropdownItem
            key={locale}
            onClick={() => switchLocale(locale)}
            ariaLabel={`${ localeNames[locale] } 선택`}
          >
            <div className={'flex w-full items-center justify-between'}>
              <div className={'p-2 flex items-center gap-2'}>
                <span>{localeFlags[locale]}</span>
                {localeNames[locale]}
              </div>
              {currentLocale === locale && <Dot className={'text-end'} />}
            </div>
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
};

export default LanguageSwitch;
