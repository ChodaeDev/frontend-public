import Link from 'next/link';
import {
  MessageSquareText,
  BookOpen,
  ShieldX,
  DoorOpen,
  Eye,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Locale } from '@/i18n/config';
import type { QuickMenuDictionary } from '@/types/common/landing';

interface QuickMenuSectionProps {
  dictionary: {
    home: {
      quickMenu: QuickMenuDictionary;
    };
  };
  locale: Locale;
}

const quickMenuItems: { icon: LucideIcon; labelKey: keyof QuickMenuDictionary; href: string }[] = [
  { icon: MessageSquareText, labelKey: 'counseling', href: '/board/counseling/write' },
  { icon: BookOpen, labelKey: 'testimonies', href: '/withdrawal/testimonies' },
  { icon: ShieldX, labelKey: 'falseClaims', href: '/doctrine/false-claims' },
  { icon: DoorOpen, labelKey: 'exitMethods', href: '/withdrawal/methods' },
  { icon: Eye, labelKey: 'recruitmentTactics', href: '/scj-info/strategy' },
  { icon: MapPin, labelKey: 'locations', href: '/prevention/locations' },
];

const fallback: QuickMenuDictionary = {
  counseling: '상담 요청',
  testimonies: '탈퇴 후기',
  falseClaims: '신천지 거짓 반증',
  exitMethods: '지혜로운 탈퇴 방법',
  recruitmentTactics: '신천지 포교 전략',
  locations: '신천지 위치정보',
};

export default function QuickMenuSection({
  dictionary,
  locale,
}: QuickMenuSectionProps) {
  const quickMenu = dictionary.home.quickMenu;

  return (
    <section className={'w-full my-6'}>
      <div className={'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2'}>
        {quickMenuItems.map(({ icon: Icon, labelKey, href }) => (
          <Link
            key={labelKey}
            href={`/${ locale }${ href }`}
            className={cn(
              'flex flex-col items-center gap-2 px-2 py-4 rounded-xl h-24',
              'bg-background/70 border border-gray8',
              'text-sub hover:text-accent1 hover:bg-gray9',
            )}
          >
            <Icon className={'size-8'} />
            <span className={'text-sm font-medium text-center leading-tight'}>
              {quickMenu[labelKey] || fallback[labelKey]}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
