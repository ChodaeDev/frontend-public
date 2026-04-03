'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/client';
import { getNavItems } from '@/config/navigation';
import Image from 'next/image';
import { cn } from '@/lib/cn';

// 수직 구분선 컴포넌트
const VerticalDivider = ({ className }: { className?: string }) => (
  <div className={cn('w-px h-2.5 bg-gray3 mt-1', className)} />
);

// 정보 항목 컴포넌트 (레이블 | 값 형태)
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className={'flex items-start gap-1.5'}>
    <span className={'min-w-12 font-bold text-sub flex justify-between'}>
      {label.split('').map((char, index) => (
        <span key={index}>{char}</span>
      ))}
    </span>
    <VerticalDivider />
    <span className={'text-main'}>{value}</span>
  </div>
);

const Footer = () => {
  const { dictionary, locale } = useTranslation();
  const t = dictionary;
  const navItems = getNavItems(locale, dictionary);

  // 하단 링크 버튼들
  const footerLinks = [
    { key: 'terms', label: t.footer.terms },
    { key: 'privacy', label: t.footer.privacy },
    { key: 'emailPolicy', label: t.footer.emailPolicy },
    { key: 'directions', label: t.footer.directions },
  ];

  const handleFooterLinkClick = (key: string) => {
    console.log(`Footer link clicked: ${ key }`);
  };

  return (
    <footer className={'w-full bg-accent4 rounded-t-3xl'}>
      <div className={'max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-10'}>
        {/* 상단: 전체 메뉴 */}
        <div className={'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8'}>
          {navItems.map((item) => (
            <div key={item.slug}>
              <Link
                href={`/${ locale }/${ item.slug }`}
                className={'text-base font-bold text-main hover:text-accent1'}
              >
                {item.label}
              </Link>
              {item.subMenus && (
                <ul className={'mt-3 flex flex-col gap-2'}>
                  {item.subMenus.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/${ locale }/${ item.slug }/${ sub.slug }`}
                        className={'text-sm text-sub hover:text-accent1 transition-colors'}
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
        <div className={'border-t border-background-secondary dark:border-gray8 mt-8 pt-6'}>
          {/* 하단 */}
          <div className={'flex flex-col lg:flex-row items-end gap-6 lg:gap-16'}>
            {/* 좌측: siteName + 링크 버튼들 */}
            <div className={'w-full lg:w-2/5 flex flex-col gap-0.5 sm:gap-1.5'}>
              <p className={'flex items-center gap-1 text-2xl font-black text-main'}>
                <Image src={'/assets/images/logo.png'} alt={t.header.logoAlt} width={36} height={36} />

                {t.header.siteName}
              </p>
              {/* 조직명 */}
              <p className={'text-sub'}>{t.footer.organizationName}</p>

              {/* 링크 버튼들 */}
              <div className={'flex items-center gap-2 flex-wrap'}>
                {footerLinks.map((link, index) => (
                  <div key={link.key} className={'flex items-center gap-2'}>
                    <button
                      onClick={() => handleFooterLinkClick(link.key)}
                      className={'text-xs text-gray1 hover:text-accent1 transition-colors'}
                    >
                      {link.label}
                    </button>
                    {index < footerLinks.length - 1 && (
                      <div className={'w-px h-2.5 bg-gray3'} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 우측: 교회 정보 + Copyright */}
            <div className={'w-full lg:w-3/5 flex flex-col gap-1 lg:gap-2 text-xs flex-1'}>
              {/* 주소 */}
              <InfoItem label={t.footer.addressLabel} value={t.footer.addressValue} />

              {/* 담임목사 + 고유번호 (데스크탑: 한 줄, 모바일: 세로) */}
              <div className={'flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6'}>
                <InfoItem label={t.footer.minister} value={t.footer.ministerName} />
                <InfoItem label={t.footer.registrationNumber} value={t.footer.registrationNumberValue} />
              </div>

              {/* 상담전화 + 후원계좌 (데스크탑: 한 줄, 모바일: 세로) */}
              <div className={'flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6'}>
                <InfoItem label={t.footer.phone} value={t.footer.phoneNumber} />
                <InfoItem label={t.footer.donation} value={t.footer.donationAccount} />
              </div>

              {/* Copyright */}
              <p className={'text-main/50 mt-4 sm:mt-0'}>
                {t.footer.copyright}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
