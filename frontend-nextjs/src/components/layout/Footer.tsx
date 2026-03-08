'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/client';
import { getNavItems } from '@/config/navigation';

const Footer = () => {
  const { dictionary, locale } = useTranslation();
  const t = dictionary;
  const navItems = getNavItems(locale, dictionary);

  return (
    <footer className={'w-full bg-accent4 rounded-t-3xl'}>
      <div className={'max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-10'}>
        {/* 상단: 전체 메뉴 */}
        <div className={'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8'}>
          {navItems.map((item) => (
            <div key={item.slug}>
              <Link
                href={`/${ locale }/${ item.slug }`}
                className={'text-base font-bold text-main/90 hover:text-main'}
              >
                {item.label}
              </Link>
              {item.subMenus && (
                <ul className={'mt-3 flex flex-col gap-2'}>
                  {item.subMenus.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/${ locale }/${ item.slug }/${ sub.slug }`}
                        className={'text-sm text-main/70 hover:text-main transition-colors'}
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div className={'border-t border-gray8 mt-8 pt-6'}>
          {/* 하단 */}
          <div className={'flex flex-col sm:flex-row items-center justify-between gap-4'}>
            <p className={'text-2xl font-black text-main'}>
              {t.header.siteName}
            </p>

            {/* 우측: Copyright */}
            <p className={'text-sm text-main/50'}>
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
