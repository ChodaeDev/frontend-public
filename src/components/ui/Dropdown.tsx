'use client';

import { useContext, ReactNode, useRef, useEffect } from 'react';
import {
  DropdownContext,
  DropdownProvider,
} from '@/components/ui/DropdownProvider';
import { cn } from '@/lib/cn';

const Dropdown = ({ children }: { children: ReactNode }) => {
  return <DropdownProvider>{children}</DropdownProvider>;
};

const DropdownTrigger = ({ children }: { children: React.ReactElement }) => {
  const { toggle } = useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle();
  };

  return <div onClick={handleClick}>{children}</div>;
};

const DropdownList = ({
  children,
  align = 'start',
  direction = 'bottom',
}: {
  children: ReactNode;
  align?: 'start' | 'end';
  direction?: 'bottom' | 'top' | 'left' | 'right';
}) => {
  const { isOpen, close } = useContext(DropdownContext);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (isOpen && contentRef.current && !contentRef.current.contains(event.target as Node)) {
        close();
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        close();
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, close]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getDirectionClasses = () => {
    switch (direction) {
      case 'top':
        return cn('bottom-full mb-2', align === 'end' ? 'right-0' : 'left-0');
      case 'left':
        return cn('right-full mr-2', align === 'end' ? 'bottom-0' : 'top-0');
      case 'right':
        return cn('left-full ml-2', align === 'end' ? 'bottom-0' : 'top-0');
      case 'bottom':
      default:
        return cn('top-full mt-2', align === 'end' ? 'right-0' : 'left-0');
    }
  };

  const getAnimationClass = () => {
    switch (direction) {
      case 'top':
        return 'animate-slideUp';
      case 'left':
        return 'animate-slideLeft';
      case 'right':
        return 'animate-slideRight';
      case 'bottom':
      default:
        return 'animate-slideDown';
    }
  };

  return isOpen ? (
    <div
      ref={contentRef}
      className={cn(getAnimationClass(), 'absolute flex flex-col p-1 z-40 min-w-36 rounded-lg bg-background border border-accent2 shadow-lg ring-1 ring-black/5 transition duration-200 ease-out', getDirectionClasses())}
      onClick={handleMenuClick}
    >
      {children}
    </div>
  ) : null;
};

const DropdownItem = ({
  children,
  onClick,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: ()=> void;
  className?: string;
  ariaLabel?: string;
}) => {
  const { close } = useContext(DropdownContext);

  const handleItemClick = () => {
    if (onClick) onClick();
    close();
  };

  return (
    <div
      className={cn('w-full rounded-md transition-colors duration-150 ease-in-out text-sm hover:bg-background-secondary cursor-pointer', className)}
      onClick={handleItemClick}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

export {
  DropdownContext,
  Dropdown,
  DropdownTrigger,
  DropdownList,
  DropdownItem,
};
