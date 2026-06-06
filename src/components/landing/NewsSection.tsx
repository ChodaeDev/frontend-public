'use client';

import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/i18n/client';
import { pressKeys, fetchPressList } from '@/lib/queries/press';
import { cn } from '@/lib/cn';
import type { Locale } from '@/i18n/config';
import type { PressPost } from '@/types/press';
import { mockPressData } from '@/lib/mocks/press';

interface NewsSectionProps {
  dictionary: {
    home: {
      news: {
        title: string;
        viewAll: string;
      };
    };
  };
  locale: Locale;
}

export default function NewsSection({ locale }: NewsSectionProps) {
  const { dictionary } = useTranslation();
  const t = dictionary.home.news as { title: string; viewAll: string };

  // TODO: API 연동 후 useMockData 및 mock 관련 내용 제거
  const useMockData = true;

  const { data: listData, isLoading } = useQuery({
    queryKey: pressKeys.list({ page: 1, size: 4, sort: 'createDate', direction: 'desc' }),
    queryFn: () => fetchPressList({ page: 1, size: 4, sort: 'createDate', direction: 'desc' }),
    enabled: !useMockData,
  });

  const posts: PressPost[] = useMockData
    ? [...mockPressData].sort((a, b) => dayjs(b.createDate).valueOf() - dayjs(a.createDate).valueOf()).slice(0, 4)
    : (listData?.payload?.slice(0, 4) ?? []);

  return (
    <section className={'w-full my-10'}>
      <div className={'flex items-center justify-between mb-6'}>
        <h2 className={'text-2xl font-bold text-main'}>{t.title || '주요 뉴스'}</h2>
        <Link
          href={`/${ locale }/scj-info/press`}
          className={'text-sm text-sub hover:text-accent1 transition-colors'}
        >
          {t.viewAll || '전체 보기'}
        </Link>
      </div>

      <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={'flex flex-col overflow-hidden'}>
              <div className={'w-full aspect-video rounded-2xl bg-gray8 animate-pulse'} />
              <div className={'flex flex-col gap-2 p-2'}>
                <div className={'h-5 bg-gray8 rounded animate-pulse'} />
                <div className={'h-4 w-1/2 bg-gray8 rounded animate-pulse'} />
              </div>
            </div>
          ))
        ) : posts.length === 0 ? (
          <p className={'col-span-full text-sm text-sub py-10 text-center'}>
            {'뉴스가 없습니다.'}
          </p>
        ) : (
          posts.map((news) => (
            <a
              key={news.id}
              href={news.sourceUrl}
              target={'_blank'}
              rel={'noopener noreferrer'}
              className={'group flex flex-col overflow-hidden transition-shadow'}
            >
              <div
                className={cn(
                  'relative w-full aspect-video overflow-hidden rounded-2xl',
                  news.thumbnailUrl ? 'bg-gray8' : 'bg-gray9',
                )}
              >
                {news.thumbnailUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={news.thumbnailUrl}
                    alt={news.title}
                    className={'absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300'}
                  />
                ) : (
                  <Image
                    src={'/assets/images/no-image.svg'}
                    alt={news.title}
                    fill
                    className={'object-contain p-2'}
                  />
                )}
              </div>
              <div className={'flex flex-col gap-1 p-2'}>
                <p className={'text-lg font-bold text-main truncate'}>
                  {news.title}
                </p>
                <div className={'flex items-center justify-between'}>
                  <span className={'text-sm text-sub'}>{news.pressName}</span>
                  <span className={'text-sm text-gray3'}>
                    {dayjs(news.createDate).format('YYYY.MM.DD')}
                  </span>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </section>
  );
}
