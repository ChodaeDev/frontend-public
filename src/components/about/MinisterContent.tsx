'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/i18n/client';

interface TimelineEntry {
  year: string;
  items: string[];
}

interface MinisterData {
  name: string;
  quote: string;
  description: string;
  role: string;
  image: string;
  timeline: TimelineEntry[];
}

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([e]) => setRatio(e.intersectionRatio),
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20), rootMargin: '-20% 0px -20% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const progress = Math.min(ratio * 2.5, 1);

  const yearColor = `color-mix(in srgb, var(--color-accent1) ${ progress * 100 }%, var(--color-gray7))`;
  const textColor = `color-mix(in srgb, var(--color-main) ${ progress * 100 }%, var(--color-gray7))`;

  return (
    <div ref={ref} className={'relative mb-8 last:mb-0'}>
      {/* 원형 도트 — line 중심(left-3 = 12px)에 도트 중심 맞춤 */}
      <div className={'absolute left-[-21.5px] md:left-[-29.5px] top-2'}>
        <span
          className={'block size-2.5 rounded-full ring-4 ring-background transition-colors duration-300'}
          style={{ backgroundColor: yearColor }}
        />
      </div>

      {/* 연도 */}
      <span className={'text-sm font-bold transition-colors duration-300'} style={{ color: yearColor }}>
        {entry.year}
      </span>

      {/* 내용 */}
      <div className={'mt-1'}>
        {entry.items.map((item, j) => (
          <p key={j} className={'text-sm leading-relaxed transition-colors duration-300'} style={{ color: textColor }}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function MinisterContent() {
  return (
    <Suspense>
      <MinisterContentInner />
    </Suspense>
  );
}

function MinisterContentInner() {
  const { dictionary } = useTranslation();
  const t = dictionary.minister as {
    shin: { name: string; quote: string; description: string; timeline: TimelineEntry[] };
    kim: { name: string; quote: string; description: string; timeline: TimelineEntry[] };
    preparing: string;
  };
  const ministryMinisters = (dictionary.home as { ministry: { ministers: { name: string; role: string }[] } }).ministry.ministers;

  const ministers: Record<string, MinisterData> = {
    shin: {
      name: t.shin.name,
      quote: t.shin.quote,
      description: t.shin.description,
      role: ministryMinisters[0]?.role || '',
      image: '/assets/images/minister-shin.png',
      timeline: t.shin.timeline,
    },
    kim: {
      name: t.kim.name,
      quote: t.kim.quote,
      description: t.kim.description,
      role: ministryMinisters[1]?.role || '',
      image: '/assets/images/minister-kim.png',
      timeline: t.kim.timeline,
    },
  };

  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'kim' ? 'kim' : 'shin';
  const [activeTab, setActiveTab] = useState(initialTab);

  const minister = ministers[activeTab];

  return (
    <div>
      {/* 탭 */}
      <div className={'flex gap-2 mb-10'}>
        {Object.entries(ministers).map(([key, m]) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); window.history.replaceState(null, '', `?tab=${ key }`); }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              activeTab === key
                ? 'bg-accent1 text-white'
                : 'bg-gray8 text-sub hover:bg-gray7'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* PC: 사진+소개 좌 | 멘트+이력 우 / 모바일: 기존 세로 스택 유지 */}
      <div className={'flex flex-col md:flex-row gap-8 md:gap-12'}>
        {/* 좌측: 사진 + 이름 + 소개 */}
        <div className={'flex flex-col items-center md:items-start shrink-0 md:sticky md:top-28 md:self-start'}>
          <div className={'w-56 h-72 md:w-64 md:h-80 relative rounded-2xl overflow-hidden shadow-lg bg-accent4'}>
            <Image
              src={minister.image}
              alt={minister.name}
              fill
              className={'object-cover'}
              priority
            />
          </div>
          <div className={'mt-6 text-center md:text-left md:max-w-64'}>
            <h2 className={'text-xl font-bold text-main mb-3'}>{minister.name}</h2>
            <p className={'text-sm text-sub leading-relaxed whitespace-pre-line'}>
              {minister.description}
            </p>
            {minister.role && (
              <p className={'text-xs text-gray4 mt-3 whitespace-pre-line'}>
                {minister.role}
              </p>
            )}
          </div>
        </div>

        {/* 우측: 멘트 + 타임라인 */}
        <div className={'flex-1 min-w-0'}>
          {/* 멘트 */}
          {minister.quote && (
            <p
              className={'text-2xl md:text-3xl leading-snug font-bold text-main mb-12 text-center md:text-left whitespace-pre-line'}
              style={{ fontFamily: 'var(--font-gowun-batang)' }}
            >
              {`\u201C${ minister.quote }\u201D`}
            </p>
          )}

          {/* 타임라인 */}
          {minister.timeline.length > 0 ? (
            <div className={'relative pl-8 md:pl-12'}>
              {/* 세로 라인 — 도트 중심(15px / md:23px)에 정렬 */}
              <div className={'absolute left-[15px] md:left-[23px] top-2 bottom-2 w-px bg-gray7'} />

              {minister.timeline.map((entry, i) => (
                <TimelineItem key={`${ activeTab }-${ i }`} entry={entry} />
              ))}
            </div>
          ) : (
            <div className={'py-20 text-center text-sub'}>
              <p>{t.preparing || '준비중입니다.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
