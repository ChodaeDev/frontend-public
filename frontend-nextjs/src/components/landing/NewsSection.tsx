import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import type { Locale } from '@/i18n/config';

interface NewsItem {
  title: string;
  image: string;
  source: string;
  date: string;
  href: string;
}

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

// TODO: API 호출로 대체
const mockNews: NewsItem[] = [
  {
    title: '이만희, 횡령 유죄 선고받자 "검찰총장 출신만 손 잡아라"',
    image: '/assets/images/mock/news4.png',
    source: 'JTBC',
    date: '2026-03-09',
    href: 'https://news.jtbc.co.kr/article/NB12288688',
  },
  {
    title: '"자료 파기하라!" 신천지 코로나 방역 방해 논란 확산',
    image: '/assets/images/mock/news1.png',
    source: 'CBS',
    date: '2025-10-09',
    href: '#',
  },
  {
    title: '이것이 \'신천지\'의 실상: 이만희와 간부들의 부패',
    image: '/assets/images/mock/news2.png',
    source: '경향신문',
    date: '2025-10-08',
    href: '#',
  },
  {
    title: '재판에서 드러난 신천지 \'민낯\'... 법의 심판은?',
    image: '/assets/images/mock/news3.png',
    source: '연합뉴스',
    date: '2025-10-07',
    href: '#',
  },
];

export default function NewsSection({ dictionary, locale }: NewsSectionProps) {
  const { title, viewAll } = dictionary.home.news;

  return (
    <section className={'w-full my-20'}>
      {/* 헤더 */}
      <div className={'flex items-center justify-between mb-6'}>
        <h2 className={'text-2xl font-bold text-main'}>{title}</h2>
        <Link
          href={`/${ locale }/scj-info/press`}
          className={'text-sm text-sub hover:text-accent1 transition-colors'}
        >
          {viewAll}
        </Link>
      </div>

      {/* 뉴스 카드 그리드 */}
      <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'}>
        {mockNews.map((news, index) => (
          <Link
            key={index}
            href={news.href}
            className={'group flex flex-col overflow-hidden transition-shadow'}
          >
            {/* 이미지 */}
            <div className={'relative w-full aspect-video overflow-hidden rounded-2xl'}>
              <Image
                src={news.image}
                alt={news.title}
                fill
                sizes={'(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'}
                className={'object-cover group-hover:scale-105 transition-transform duration-300'}
              />
            </div>
            {/* 콘텐츠 */}
            <div className={'flex flex-col gap-1 p-2'}>
              <p className={'text-lg font-bold text-main truncate'}>
                {news.title}
              </p>
              <div className={'flex items-center justify-between'}>
                <span className={'text-sm text-sub'}>{news.source}</span>
                <span className={'text-sm text-gray3'}>
                  {dayjs(news.date).format('YYYY.MM.DD')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
