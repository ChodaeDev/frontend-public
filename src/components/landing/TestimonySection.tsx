'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface TestimonyItem {
  id: string;
  title: string;
  image: string;
  date: string;
}

interface TestimonySectionProps {
  dictionary: {
    home: {
      testimony: {
        title: string;
        viewAll: string;
      };
    };
  };
  locale: Locale;
}

// TODO: API 호출로 대체
const mockTestimonies: TestimonyItem[] = [
  { id: 'idtest123', title: '2015년 신천지 탈퇴 간증', image: '/assets/images/mock/testimony1.png', date: '2025-03-15' },
  { id: 'idtest123', title: '신천지에서 2개월동안 감금당하고 협박 당한 사연', image: '/assets/images/mock/testimony2.png', date: '2025-02-20' },
  { id: 'idtest123', title: '포교 현장에서 탈퇴까지, 신천지의 실체를 증언합니다', image: '/assets/images/mock/testimony3.png', date: '2025-01-10' },
  { id: 'idtest123', title: '대학생 시절 빠진 신천지, 졸업 후 겨우 벗어나다', image: '/assets/images/mock/testimony1.png', date: '2024-12-05' },
  { id: 'idtest123', title: '신천지 탈퇴 후 교회로 돌아온 감사의 간증', image: '/assets/images/mock/testimony2.png', date: '2024-11-18' },
  { id: 'idtest123', title: '가정이 무너질 뻔했던 위기, 상담소 덕분에 회복했습니다', image: '/assets/images/mock/testimony3.png', date: '2024-10-22' },
];

const lgCardWidth = 420;
const smCardWidth = 280;
const lgGap = 20;
const smGap = 12;
const smBreakpoint = 640;
const scrollSpeed = 0.4;

export default function TestimonySection({ dictionary, locale }: TestimonySectionProps) {
  const { title, viewAll } = dictionary.home.testimony;
  const items = mockTestimonies;
  const totalItems = items.length;
  const displayItems = [...items, ...items];

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

  // 0.5초 뒤 자동 스크롤 재개
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

        // 화살표 애니메이션 처리
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
          // 연속 자동 스크롤
          offset.current += scrollSpeed;
        }

        // 무한 루프 리셋
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

  // 화살표 핸들러
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

  // 마우스 hover
  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
    isPaused.current = true;
    clearTimeout(resumeTimer.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    startResumeTimer();
  }, [startResumeTimer]);

  // 마우스 드래그 없음 (PC는 화살표만 사용)

  // 터치 이벤트 - passive: false로 수직 스크롤 차단
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

  return (
    <section className={'my-10 bg-gray9 overflow-x-hidden'}>
      {/* 헤더 */}
      <div className={'flex items-center justify-between max-w-7xl py-6 mx-auto px-4 md:px-6 lg:px-10'}>
        <h2 className={'text-2xl font-bold text-main'}>{title}</h2>
        <Link
          href={`/${ locale }/withdrawal/testimonies`}
          className={'text-sm text-sub hover:text-accent1 transition-colors'}
        >
          {viewAll}
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
            className={`flex pl-[max(1rem,calc((100vw-80rem)/2+1rem))] ${ isDragging ? 'select-none' : '' }`}
            style={{ gap: `${ gap }px` }}
          >
            {displayItems.map((item, index) => (
              <div
                key={index}
                className={'shrink-0'}
                style={{ width: `${ cardWidth }px` }}
              >
                <div className={'relative aspect-video overflow-hidden rounded-2xl'}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={'(min-width: 640px) 420px, 280px'}
                    className={'object-cover'}
                  />
                </div>
                <div className={'flex flex-col gap-1 p-2'}>
                  <p className={'text-lg font-bold text-main truncate'}>
                    {item.title}
                  </p>
                  <div className={'flex items-center justify-between'}>
                    <span className={'text-sm text-sub'}>{item.id}</span>
                    <span className={'text-sm text-gray3'}>
                      {dayjs(item.date).format('YYYY.MM.DD')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 좌우 화살표 - sm 이상, hover 시 표시 */}
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
