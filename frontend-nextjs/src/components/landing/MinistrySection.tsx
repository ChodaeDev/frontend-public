import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';

interface Minister {
  name: string;
  role: string;
}

interface MinistryDictionary {
  title: string;
  ministers: Minister[];
}

interface MinistrySectionProps {
  dictionary: {
    home: {
      ministry: MinistryDictionary;
    };
  };
  locale: Locale;
}

const ministerImages = [
  '/assets/images/minister-shin.png',
  '/assets/images/minister-kim.png',
];

export default function MinistrySection({ dictionary, locale }: MinistrySectionProps) {
  const { title, ministers } = dictionary.home.ministry;

  return (
    <section className={'w-full py-12 lg:py-20'}>
      <div className={'flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between gap-5 sm:gap-10 lg:gap-16'}>
        {/* 좌측 텍스트 */}
        <div className={'text-center lg:text-left'}>
          <h2
            className={
              'text-2xl sm:text-4xl xl:text-6xl font-bold text-main leading-tight whitespace-pre-line'
            }
          >
            {title}
          </h2>
        </div>

        {/* 우측 카드 영역 */}
        <div className={'flex gap-2.5 sm:gap-5'}>
          {ministers.map((minister, index) => (
            <Link
              key={index}
              href={`/${ locale }/about/pastor`}
              className={'group relative w-40 sm:w-72 aspect-3/4 rounded-3xl overflow-hidden bg-accent4'}
            >
              <Image
                src={ministerImages[index]}
                alt={minister.name}
                fill
                className={
                  index === 0
                    ? 'object-cover'
                    : 'object-cover object-[10%_bottom]'
                }
              />
              {/* 그라데이션 오버레이 - hover 시 accent1으로 변경 */}
              <div className={'absolute inset-0 rounded-3xl bg-linear-to-t from-black/45 to-transparent transition-all duration-300 group-hover:hidden'} />
              {/* 목사님 정보 */}
              <div className={'absolute bottom-0 left-0 right-0 p-5'}>
                <p className={'text-lg font-bold text-white'}>
                  {minister.name}
                </p>
                <p className={'hidden sm:block text-xs text-white mt-0.5 whitespace-pre-line'}>
                  {minister.role}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
