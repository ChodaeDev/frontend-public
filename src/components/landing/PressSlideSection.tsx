'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/i18n/client';
import { pressKeys, fetchPressList } from '@/lib/queries/press';
import { cn } from '@/lib/cn';
import type { Locale } from '@/i18n/config';
import type { PressPost } from '@/types/press';
import { mockPressData } from '@/lib/mocks/press';

interface PressSlideSectionProps {
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

const lgCardWidth = 420;
const smCardWidth = 280;
const lgGap = 20;
const smGap = 12;
const smBreakpoint = 640;
const scrollSpeed = 0.4;

export default function PressSlideSection({ locale }: PressSlideSectionProps) {
  const { dictionary } = useTranslation();
  const t = dictionary.home.news as { title: string; viewAll: string };

  // TODO: API 연동 후 useMockData 및 mock 관련 내용 제거
  const useMockData = true;

  const { data: listData } = useQuery({
    queryKey: pressKeys.list({ page: 1, size: 8, sort: 'publishedAt', direction: 'desc' }),
    queryFn: () => fetchPressList({ page: 1, size: 8, sort: 'publishedAt', direction: 'desc' }),
    enabled: !useMockData,
  });

  const posts: PressPost[] = useMockData
    ? [...mockPressData].filter((p) => p.isPublished).sort((a, b) => dayjs(b.publishedAt).valueOf() - dayjs(a.publishedAt).valueOf()).slice(0, 8)
    : (listData?.payload?.slice(0, 8) ?? []);

  const totalItems = posts.length;
  const displayItems = [...posts, ...posts];

  // 반응형 카드 크기
  const [isSmall, setIsSmall] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < smBreakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const cardWidth = isSmall ? smCardWidth : lgCardWidth;
  const gap = isSmall ? smGap : lgGap;
  const itemSlot = cardWidth + gap;
  const loopPoint = totalItems * itemSlot;

  // refs (rAF 루프에서 직접 접근)
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);
  const offset = useRef(0);
  const isPaused = useRef(false);
  const isHovering = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const arrowTarget = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragDelta = useRef(0);
  const itemSlotRef = useRef(itemSlot);
  const loopPointRef = useRef(loopPoint);

  useEffect(() => {
    itemSlotRef.current = itemSlot;
    loopPointRef.current = loopPoint;
  }, [itemSlot, loopPoint]);

  const startResumeTimer = useCallback(() => {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isPaused.current = false;
    }, 500);
  }, []);

  // rAF 루프 - 부드러운 연속 스크롤
  useEffect(() => {
    const animate = () => {
      const track = trackRef.current;
      if (track) {
        const lp = loopPointRef.current;

        if (arrowTarget.current !== null) {
          const diff = arrowTarget.current - offset.current;
          if (Math.abs(diff) < 1) {
            offset.current = arrowTarget.current;
            arrowTarget.current = null;
            if (!isHovering.current) startResumeTimer();
          } else {
            offset.current += diff * 0.12;
          }
        } else if (!isPaused.current && !isDraggingRef.current) {
          offset.current += scrollSpeed;
        }

        if (offset.current >= lp) {
          offset.current -= lp;
          if (arrowTarget.current !== null) arrowTarget.current -= lp;
        }
        if (offset.current < 0) {
          offset.current += lp;
          if (arrowTarget.current !== null) arrowTarget.current += lp;
        }

        const visual = isDraggingRef.current
          ? offset.current - dragDelta.current
          : offset.current;

        track.style.transform = `translateX(${ -visual }px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      clearTimeout(resumeTimer.current);
    };
  }, [startResumeTimer]);

  const goRight = useCallback(() => {
    isPaused.current = true;
    clearTimeout(resumeTimer.current);
    arrowTarget.current = offset.current + itemSlotRef.current;
  }, []);

  const goLeft = useCallback(() => {
    isPaused.current = true;
    clearTimeout(resumeTimer.current);
    arrowTarget.current = offset.current - itemSlotRef.current;
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
    isPaused.current = true;
    clearTimeout(resumeTimer.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    startResumeTimer();
  }, [startResumeTimer]);

  // 터치 이벤트
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touching = false;
    let startX = 0;
    let startY = 0;
    let direction: 'none' | 'horizontal' | 'vertical' = 'none';

    const onTouchStart = (e: TouchEvent) => {
      isPaused.current = true;
      clearTimeout(resumeTimer.current);
      touching = true;
      direction = 'none';
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDraggingRef.current = true;
      setIsDragging(true);
      dragDelta.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touching) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      if (direction === 'none') {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
          direction = 'horizontal';
        } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5) {
          direction = 'vertical';
          touching = false;
          isDraggingRef.current = false;
          setIsDragging(false);
          dragDelta.current = 0;
          startResumeTimer();
          return;
        }
      }

      if (direction === 'horizontal') {
        e.preventDefault();
        dragDelta.current = dx;
      }
    };

    const onTouchEnd = () => {
      if (!touching) return;
      touching = false;
      isDraggingRef.current = false;
      setIsDragging(false);
      offset.current -= dragDelta.current;
      dragDelta.current = 0;
      const lp = loopPointRef.current;
      if (offset.current >= lp) offset.current -= lp;
      if (offset.current < 0) offset.current += lp;
      startResumeTimer();
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [startResumeTimer]);

  if (totalItems === 0) return null;

  return (
    <section className={'my-10 bg-gray9 overflow-x-hidden'}>
      {/* 헤더 */}
      <div className={'flex items-center justify-between max-w-7xl py-6 mx-auto px-4 md:px-6 lg:px-10'}>
        <h2 className={'text-2xl font-bold text-main'}>{t.title || '신천지 언론보도'}</h2>
        <Link
          href={`/${ locale }/scj-info/press`}
          className={'text-sm text-sub hover:text-accent1 transition-colors'}
        >
          {t.viewAll || '전체 보기'}
        </Link>
      </div>

      {/* 캐러셀 */}
      <div
        className={'relative group w-[calc(100vw-8px)] left-1/2 -translate-x-1/2 pb-6'}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={containerRef}
          className={'overflow-hidden'}
        >
          <div
            ref={trackRef}
            className={cn('flex pl-[max(1rem,calc((100vw-80rem)/2+1rem))]', isDragging && 'select-none')}
            style={{ gap: `${ gap }px` }}
          >
            {displayItems.map((item, index) => (
              <a
                key={index}
                href={item.sourceUrl}
                target={'_blank'}
                rel={'noopener noreferrer'}
                className={'group/card shrink-0'}
                style={{ width: `${ cardWidth }px` }}
              >
                <div
                  className={cn(
                    'relative aspect-video overflow-hidden rounded-2xl',
                    item.thumbnailUrl ? 'bg-gray8' : 'bg-gray9',
                  )}
                >
                  {item.thumbnailUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className={'absolute inset-0 h-full w-full object-cover group-hover/card:scale-105 transition-transform duration-300'}
                    />
                  ) : (
                    <Image
                      src={'/assets/images/no-image.png'}
                      alt={item.title}
                      fill
                      className={'object-contain p-2'}
                    />
                  )}
                </div>
                <div className={'flex flex-col gap-1 p-2'}>
                  <p className={'text-lg font-bold text-main truncate'}>
                    {item.title}
                  </p>
                  <div className={'flex items-center justify-between'}>
                    <span className={'text-sm text-sub'}>{item.pressName}</span>
                    <span className={'text-sm text-gray3'}>
                      {dayjs(item.publishedAt).format('YYYY.MM.DD')}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 좌우 화살표 */}
        <button
          onClick={goLeft}
          className={
            `hidden sm:block absolute left-4 top-[calc(50%-20px)] -translate-y-1/2
            bg-background/60 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-accent1 text-main hover:text-white`
          }
          aria-label={'Previous'}
        >
          <ChevronLeft className={'size-5'} />
        </button>
        <button
          onClick={goRight}
          className={
            `hidden sm:block absolute right-4 top-[calc(50%-20px)] -translate-y-1/2
            bg-background/60 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-accent1 text-main hover:text-white`
          }
          aria-label={'Next'}
        >
          <ChevronRight className={'size-5'} />
        </button>
      </div>
    </section>
  );
}
