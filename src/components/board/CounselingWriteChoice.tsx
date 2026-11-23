'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, KeyRound, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from '@/i18n/client';
import { useAuthStore } from '@/store/authStore';
import { useHydrated } from '@/lib/hooks/useHydrated';

interface ChoiceCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
}

function ChoiceCard({ href, icon: Icon, title, description, cta }: ChoiceCardProps) {
  return (
    <Link
      href={href}
      className={'group flex flex-col gap-4 rounded-xl border border-gray8 bg-background p-6 transition-colors hover:border-accent2 hover:bg-background-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent2/40'}
    >
      <span className={'flex size-12 items-center justify-center rounded-full bg-background-secondary text-accent1 transition-colors group-hover:bg-background'}>
        <Icon className={'size-6'} strokeWidth={1.6} />
      </span>
      <div className={'flex flex-col gap-1.5'}>
        <h2 className={'text-lg font-bold text-main'}>{title}</h2>
        <p className={'text-sm leading-relaxed text-sub'}>{description}</p>
      </div>
      <span className={'mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-accent1'}>
        {cta}
        <ArrowRight className={'size-4 transition-transform group-hover:translate-x-1'} />
      </span>
    </Link>
  );
}

/** 비회원/회원 작성 선택. 로그인한 사용자는 선택 없이 회원 폼으로 보낸다 */
export default function CounselingWriteChoice() {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const { dictionary, locale } = useTranslation();
  const t = dictionary.board;

  const base = `/${ locale }/board/counseling/write`;

  useEffect(() => {
    if (user) router.replace(`${ base }/member`);
  }, [user, router, base]);

  if (!hydrated || user) return null;

  return (
    <div className={'flex flex-col gap-6'}>
      <div className={'flex flex-col gap-1'}>
        <p className={'text-lg font-semibold text-main'}>{t.writeChoiceTitle || '어떤 방법으로 신청하시겠어요?'}</p>
        <p className={'text-sm text-sub'}>{t.writeChoiceDesc || '어느 쪽으로 쓰셔도 상담글은 모두 비공개로 올라갑니다.'}</p>
      </div>

      <div className={'grid grid-cols-1 gap-4 md:grid-cols-2'}>
        <ChoiceCard
          href={`${ base }/guest`}
          icon={KeyRound}
          title={t.guestWriteTitle || '비회원으로 신청'}
          description={t.guestWriteDesc || '가입하지 않고 이름과 연락처만 남기면 됩니다. 글을 열 때 쓸 비밀번호는 직접 정합니다.'}
          cta={t.guestWriteCta || '비회원으로 작성'}
        />
        <ChoiceCard
          href={`/${ locale }/login?returnTo=${ encodeURIComponent(`${ base }/member`) }`}
          icon={UserRound}
          title={t.memberWriteTitle || '회원으로 신청'}
          description={t.memberWriteDesc || '로그인하면 비밀번호 없이 내 글과 답변을 바로 확인할 수 있습니다.'}
          cta={t.memberWriteCta || '로그인하고 작성'}
        />
      </div>

      <p className={'text-sm text-sub'}>
        {t.signupPrompt || '아직 회원이 아니신가요?'}{' '}
        <Link href={`/${ locale }/signup`} className={'font-semibold text-accent1 hover:underline'}>
          {t.signupLink || '회원가입'}
        </Link>
      </p>
    </div>
  );
}
