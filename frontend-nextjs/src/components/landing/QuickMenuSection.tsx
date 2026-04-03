import Link from 'next/link';
import {
  MessageSquareText,
  BookOpen,
  ShieldX,
  DoorOpen,
  Eye,
  MapPin,
} from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface QuickMenuItem {
  icon: React.ReactNode;
  labelKey: keyof QuickMenuDictionary;
  href: string;
}

interface QuickMenuDictionary {
  counseling: string;
  testimonies: string;
  falseClaims: string;
  exitMethods: string;
  recruitmentTactics: string;
  locations: string;
}

interface QuickMenuSectionProps {
  dictionary: {
    home: {
      quickMenu: QuickMenuDictionary;
    };
  };
  locale: Locale;
}

const iconClassName = 'w-10 h-10 text-accent1';

const quickMenuItems: QuickMenuItem[] = [
  {
    icon: <MessageSquareText className={iconClassName} />,
    labelKey: 'counseling',
    href: '/board/counseling',
  },
  {
    icon: <BookOpen className={iconClassName} />,
    labelKey: 'testimonies',
    href: '/withdrawal/testimonies',
  },
  {
    icon: <ShieldX className={iconClassName} />,
    labelKey: 'falseClaims',
    href: '/doctrine/false-claims',
  },
  {
    icon: <DoorOpen className={iconClassName} />,
    labelKey: 'exitMethods',
    href: '/withdrawal/methods',
  },
  {
    icon: <Eye className={iconClassName} />,
    labelKey: 'recruitmentTactics',
    href: '/scj-info/strategy',
  },
  {
    icon: <MapPin className={iconClassName} />,
    labelKey: 'locations',
    href: '/prevention/locations',
  },
];

export default function QuickMenuSection({
  dictionary,
  locale,
}: QuickMenuSectionProps) {
  const quickMenu = dictionary.home.quickMenu;
  const fallback: QuickMenuDictionary = {
    counseling: '상담 요청',
    testimonies: '탈퇴 후기',
    falseClaims: '신천지 거짓 반증',
    exitMethods: '지혜로운 탈퇴 방법',
    recruitmentTactics: '신천지 포교 전략',
    locations: '신천지 위치정보',
  };

  return (
    <section className={'w-full my-6'}>
      <div className={'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2'}>
        {quickMenuItems.map((item) => (
          <Link
            key={item.labelKey}
            href={`/${ locale }/${ item.href }`}
            className={
              `flex flex-col items-center gap-3 px-2 py-4 rounded-2xl
              bg-accent4 hover:bg-gray8
              transition-all duration-200`
            }
          >
            {item.icon}
            <span className={'text-xs sm:text-sm font-medium text-main text-center leading-tight'}>
              {quickMenu[item.labelKey] || fallback[item.labelKey]}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
