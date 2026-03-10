import Image from 'next/image';
import SlotNumber from '@/components/ui/SlotNumber';
import type { Locale } from '@/i18n/config';

interface LandingImageSectionProps {
  dictionary: {
    home: {
      title: string;
      subtitle: string;
      stats: {
        unit?: string;
        yearlyAverage: string;
        totalConversions: string;
      };
    };
  };
  locale: Locale;
  stats: {
    yearlyCount: number;
    totalCount: number;
  };
}

export default function LandingImageSection({
  dictionary,
  locale,
  stats,
}: LandingImageSectionProps) {
  return (
    <div className={'animate-fadeIn w-full my-10'}>
      {/* 이미지 컨테이너 */}
      <div className={'relative w-full'}>
        <Image
          src={'/assets/images/landingImage.png'}
          alt={'home'}
          width={1168}
          height={480}
          priority
          className={'w-full h-auto rounded-3xl'}
        />
        {/* 그라데이션 오버레이 - lg 이상에서만 표시 */}
        <div className={'hidden lg:block absolute inset-0 rounded-3xl bg-linear-to-t from-black/65 to-transparent'} />
        {/* 텍스트 콘텐츠 - lg 이상에서 이미지 위 오버레이 */}
        <div className={'hidden lg:flex absolute bottom-0 left-0 right-0 p-10 flex-row justify-between items-end gap-4'}>
          <div>
            <h1 className={'animate-heroSlideUp text-4xl font-bold text-white'}>
              {dictionary.home.title}
            </h1>
            <p className={'animate-heroSlideUp-delay-1 text-lg text-white/90 mt-2'}>
              {dictionary.home.subtitle}
            </p>
          </div>
          <div className={'animate-heroSlideUp-delay-2 flex items-center gap-3 text-white shrink-0'}>
            <div className={'flex flex-col items-end'}>
              <p className={'leading-tight flex items-start'}>
                <SlotNumber
                  value={stats.yearlyCount}
                  locale={locale}
                  delay={300}
                  className={'text-6xl font-black'}
                />
                {dictionary.home.stats.unit && (
                  <span className={'text-base font-normal text-white/80 mt-1'}>
                    {dictionary.home.stats.unit}
                  </span>
                )}
              </p>
              <p className={'text-sm text-white/80 mt-1'}>{dictionary.home.stats.yearlyAverage}</p>
            </div>
            <span className={'text-4xl text-white/50 mt-1.5'}>{'/'}</span>
            <div className={'flex flex-col items-end'}>
              <p className={'leading-tight flex items-start'}>
                <SlotNumber
                  value={stats.totalCount}
                  locale={locale}
                  delay={300}
                  className={'text-6xl font-black'}
                />
                {dictionary.home.stats.unit && (
                  <span className={'text-base font-normal text-white/80 mt-1'}>
                    {dictionary.home.stats.unit}
                  </span>
                )}
              </p>
              <p className={'text-sm text-white/80 mt-1'}>{dictionary.home.stats.totalConversions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 텍스트 콘텐츠 - lg 미만에서 이미지 아래 표시 */}
      <div className={'w-full flex lg:hidden flex-col sm:flex-row items-center gap-4 pt-4'}>
        <div className={'w-full'}>
          <h1 className={'animate-heroSlideUp text-2xl font-bold text-main'}>
            {dictionary.home.title}
          </h1>
          <p className={'animate-heroSlideUp-delay-1 text-base text-gray1'}>
            {dictionary.home.subtitle}
          </p>
        </div>
        <div className={'animate-heroSlideUp-delay-2 flex items-center gap-2 shrink-0'}>
          <div className={'flex flex-col items-end'}>
            <p className={'leading-tight flex items-start'}>
              <SlotNumber
                value={stats.yearlyCount}
                locale={locale}
                delay={300}
                className={'text-3xl font-black text-accent1'}
              />
              {dictionary.home.stats.unit && (
                <span className={'text-sm font-normal text-sub mt-1'}>
                  {dictionary.home.stats.unit}
                </span>
              )}
            </p>
            <p className={'text-sm text-sub mt-1'}>{dictionary.home.stats.yearlyAverage}</p>
          </div>
          <span className={'text-3xl text-gray4 mt-1'}>{'/'}</span>
          <div className={'flex flex-col items-end'}>
            <p className={'leading-tight flex items-start'}>
              <SlotNumber
                value={stats.totalCount}
                locale={locale}
                delay={300}
                className={'text-3xl font-black text-accent1'}
              />
              {dictionary.home.stats.unit && (
                <span className={'text-sm font-normal text-sub mt-1'}>
                  {dictionary.home.stats.unit}
                </span>
              )}
            </p>
            <p className={'text-sm text-sub mt-1'}>{dictionary.home.stats.totalConversions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
