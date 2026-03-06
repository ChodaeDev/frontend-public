'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Dropdown,
  DropdownList,
  DropdownItem,
  DropdownTrigger,
} from '@/components/ui/Dropdown';
import { LucideIcon, Dot, Monitor, Moon, Sun } from 'lucide-react';
import { useIsLgScreen } from '@/lib/useMediaQuery';

interface ThemeItemProps {
  newTheme: string;
  label: string;
  Icon: LucideIcon;
}

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const isLgScreen = useIsLgScreen();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className={'size-[32px] flex items-center justify-center'}>
      <div className={'relative size-5'}>
        <div className={'absolute inset-0 rounded-full border-2 border-t-accent1 border-x-transparent border-b-secondary animate-spin'} />
        <div className={'absolute inset-0 flex items-center justify-center'}>
          <div className={'size-2 rounded-full bg-accent1 animate-pulse'} />
        </div>
      </div>
    </div>
  );

  const ThemeItem = ({ newTheme, Icon, label }: ThemeItemProps) => (
    <DropdownItem onClick={() => setTheme(newTheme)} ariaLabel={`${ label } 테마 선택`}>
      <div className={'flex w-full items-center justify-between'}>
        <div className={'p-2 flex items-center gap-2'}>
          <Icon width={14} />
          {label}
        </div>
        {theme === newTheme && <Dot className={'text-end'} />}
      </div>
    </DropdownItem>
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className={'flex rounded-md p-2 hover:bg-background-secondary cursor-pointer'}>
          <Sun className={'size-4 text-main dark:hidden'} />
          <Moon className={'size-4 text-main hidden dark:block'} />
        </div>
      </DropdownTrigger>
      <DropdownList align={'end'} direction={isLgScreen ? 'bottom' : 'left'}>
        <ThemeItem newTheme={'light'} label={'Light'} Icon={Sun} />
        <ThemeItem newTheme={'dark'} label={'Dark'} Icon={Moon} />
        <ThemeItem newTheme={'system'} label={'System'} Icon={Monitor} />
      </DropdownList>
    </Dropdown>
  );
};

export default ThemeSwitch;
