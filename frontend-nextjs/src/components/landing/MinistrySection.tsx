import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { ChevronRight } from 'lucide-react';

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
    <section className={'w-full my-10'}>
      <div className={'flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between gap-5'}>
        {/* 좌측 텍스트 */}
        <div className={'text-center lg:text-left shrink-0 max-w-xl'}>
          <h2
            className={
              'text-2xl sm:text-4xl xl:text-6xl font-bold text-main leading-tight whitespace-pre-line'
            }
          >
            {title}
          </h2>
        </div>

        {/* 우측 카드 영역 */}
        <div className={'sm:w-auto w-full  flex gap-2.5 sm:gap-5 justify-center shrink-0'}>
          {ministers.map((minister, index) => (
            <Link
              key={index}
              href={`/${ locale }/about/minister`}
              className={'group relative w-1/2 sm:w-72 aspect-3/4 rounded-3xl overflow-hidden bg-accent4'}
            >
              <Image
                src={ministerImages[index]}
                alt={minister.name}
                fill
                sizes={'(min-width: 640px) 288px, 50vw'}
                className={
                  index === 0
                    ? 'object-cover'
                    : 'object-cover'
                }
              />
              {/* 그라데이션 오버레이 - hover 시 accent1으로 변경 */}
              <div className={'hidden sm:block absolute inset-0 rounded-3xl bg-linear-to-t from-black/45 to-transparent transition-all duration-300 group-hover:hidden'} />
              <span className={'hidden sm:block absolute right-4 top-4 p-2 rounded-full bg-accent1 backdrop-blur-sm group-hover:bg-accent1/60 transition-all duration-300'}>
                <ChevronRight className={'size-4 text-white'} />
              </span>
              {/* 목사님 정보 */}
              <div className={'absolute bottom-0 left-0 right-0 p-5'}>
                <span className={'flex items-center justify-between'}>
                  <p className={'text-lg font-bold text-white text-shadow-sm'}>
                    {minister.name}
                  </p>
                  <span className={'block sm:hidden p-1 rounded-full bg-accent1 backdrop-blur-sm group-hover:bg-accent1/60 transition-all duration-300'}>
                    <ChevronRight className={'size-4 text-white'} />
                  </span>
                </span>
                <p className={'hidden sm:block text-xs text-white mt-0.5 whitespace-pre-line text-shadow-sm'}>
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
