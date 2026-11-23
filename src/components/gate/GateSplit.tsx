'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, HeartHandshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import HouseHeart from '@/components/gate/HouseHeartIcon';

export interface GateDict {
  counselEyebrow: string;
  counselTitle: string;
  counselCta: string;
  homeEyebrow: string;
  homeTitle: string;
  homeCta: string;
}

interface GatePanelProps {
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  cta: string;
  tone: 'warm' | 'cool';
}

// 톤별 블롭 색상. Tailwind JIT가 읽을 수 있도록 전체 클래스를 그대로 적는다.
const blobTones = {
  warm: ['bg-gate-warm1/70', 'bg-gate-warm2/50', 'bg-gate-warm3/45'],
  cool: ['bg-gate-cool1/50', 'bg-gate-cool2/50', 'bg-gate-cool3/55'],
};

const accentTones = {
  warm: {
    icon: 'group-hover:text-gate-warm2 group-focus-visible:text-gate-warm2',
    ring: 'group-hover:ring-gate-warm2/40 group-focus-visible:ring-gate-warm2/40',
    eyebrow: 'group-hover:text-main group-focus-visible:text-main',
  },
  cool: {
    icon: 'group-hover:text-gate-cool2 group-focus-visible:text-gate-cool2',
    ring: 'group-hover:ring-gate-cool2/40 group-focus-visible:ring-gate-cool2/40',
    eyebrow: 'group-hover:text-main group-focus-visible:text-main',
  },
};

function GatePanel({ href, icon: Icon, eyebrow, title, cta, tone }: GatePanelProps) {
  const [blobA, blobB, blobC] = blobTones[tone];
  const accent = accentTones[tone];
  const glowRef = useRef<HTMLDivElement>(null);

  // 색상 영역이 마우스를 따라오게 한다. 리렌더 없이 CSS 변수만 바꾸고, 이동은 transition으로 부드럽게 늦춘다
  const moveGlow = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse' || !glowRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    glowRef.current.style.setProperty('--gx', `${ e.clientX - rect.left }px`);
    glowRef.current.style.setProperty('--gy', `${ e.clientY - rect.top }px`);
  };

  // 마우스가 나가면 가운데로 돌아간다
  const resetGlow = () => {
    glowRef.current?.style.removeProperty('--gx');
    glowRef.current?.style.removeProperty('--gy');
  };

  return (
    <Link
      href={href}
      onPointerMove={moveGlow}
      onPointerLeave={resetGlow}
      className={'group relative flex flex-1 items-center justify-center px-6 pt-28 pb-16 md:pt-24 focus:outline-none'}
    >
      {/* 호버 시 떠오르는 컬러 블롭. 터치 기기(모바일)는 호버가 없으므로 처음부터 중앙에 고정해 바로 보여 준다 */}
      <div
        aria-hidden
        className={'pointer-events-none absolute inset-0 scale-95 opacity-0 transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 pointer-coarse:scale-100 pointer-coarse:opacity-100 pointer-coarse:transition-none'}
      >
        {/* 콘텐츠 주변에 작게 모인 색. 패널 밖으로 번져도 잘리지 않게 패널에 overflow를 두지 않는다 */}
        <div
          ref={glowRef}
          className={'absolute left-[var(--gx,50%)] top-[var(--gy,50%)] size-[min(78vw,420px)] -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:size-[min(34vw,480px)]'}
        >
          <div className={'absolute inset-0 animate-gateSwirl'}>
            <div className={cn('absolute top-[2%] left-[6%] size-[52%] rounded-full blur-[72px] animate-gateDriftA', blobA)} />
            <div className={cn('absolute top-[30%] right-[2%] size-[48%] rounded-full blur-[72px] animate-gateDriftB', blobB)} />
            <div className={cn('absolute bottom-[4%] left-[22%] size-[46%] rounded-full blur-[72px] animate-gateDriftC', blobC)} />
          </div>
        </div>
      </div>

      <div className={'relative flex max-w-md flex-col items-center text-center'}>
        <span
          className={cn(
            'mb-3 flex size-24 items-center justify-center rounded-full bg-background/30 ring-1 ring-transparent backdrop-blur-md transition-all duration-500 group-hover:scale-105 group-focus-visible:scale-105',
            accent.ring,
          )}
        >
          <Icon strokeWidth={1.4} className={cn('size-11 text-gray3 transition-colors duration-500', accent.icon)} />
        </span>

        <span className={cn('mb-6 text-sm font-semibold tracking-wide text-gray3 transition-colors duration-500', accent.eyebrow)}>
          {eyebrow}
        </span>

        <h2 className={'whitespace-pre-line break-keep text-[22px] font-bold leading-snug text-main sm:text-3xl'}>
          {title}
        </h2>

        <span className={'mt-8 inline-flex items-center gap-2 text-base font-semibold text-main'}>
          {cta}
          <ArrowRight className={'size-4 transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5'} />
        </span>

      </div>
    </Link>
  );
}

interface GateSplitProps {
  locale: string;
  t: GateDict;
}

export default function GateSplit({ locale, t }: GateSplitProps) {
  return (
    <div className={'relative flex min-h-dvh flex-col overflow-hidden bg-background md:flex-row'}>
      {/* 비로그인은 바로 비회원 폼, 로그인 상태면 비회원 폼이 회원 폼으로 넘겨 준다 */}
      <GatePanel
        href={`/${ locale }/board/counseling/write/guest`}
        icon={HeartHandshake}
        eyebrow={t.counselEyebrow}
        title={t.counselTitle}
        cta={t.counselCta}
        tone={'warm'}
      />

      {/* 가운데 구분선: 데스크톱은 세로, 모바일은 가로 */}
      <span
        aria-hidden
        className={'pointer-events-none absolute left-1/2 top-1/2 z-10 h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-gray7 md:h-8 md:w-px'}
      />

      <GatePanel
        href={`/${ locale }/home`}
        icon={HouseHeart}
        eyebrow={t.homeEyebrow}
        title={t.homeTitle}
        cta={t.homeCta}
        tone={'cool'}
      />
    </div>
  );
}
