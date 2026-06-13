'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { ko, enUS, ja, zhCN, de } from 'react-day-picker/locale';
import dayjs from 'dayjs';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { inputStyle, labelStyle } from './form-styles';
import FormSelect from './FormSelect';
import { getYears, getMonths, formatBirthday } from '@/lib/date';
import { useTranslation } from '@/i18n/client';
import { cn } from '@/lib/cn';

const localeMap = {
  ko,
  en: enUS,
  ja,
  zh: zhCN,
  de,
} as const;

type BirthdayPickerProps = {
  name?: string;
  label?: string;
  defaultValue?: string;
  className?: string;
};

export function BirthdayPicker({
  name = 'birthday',
  label,
  defaultValue,
  className,
}: BirthdayPickerProps) {
  const { locale, dictionary } = useTranslation();
  const t = dictionary.common;
  const displayLabel = label ?? (dictionary.userForm.birthday || '생년월일');
  const defaultDate = new Date(1994, 2, 15);

  const [selected, setSelected] = useState<Date | undefined>(() => {
    if (defaultValue) {
      const parsed = dayjs(defaultValue);
      if (parsed.isValid()) return parsed.toDate();
    }
    return defaultDate;
  });
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState<Date>(selected ?? defaultDate);
  const containerRef = useRef<HTMLDivElement>(null);

  const years = getYears(1930);
  const months = getMonths();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleYearChange = (val: string) => {
    const newMonth = new Date(month);
    newMonth.setFullYear(parseInt(val, 10));
    setMonth(newMonth);
  };

  const handleMonthChange = (val: string) => {
    const newMonth = new Date(month);
    newMonth.setMonth(parseInt(val, 10) - 1);
    setMonth(newMonth);
  };

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    if (date) {
      setMonth(date);
      setIsOpen(false);
    }
  };

  // 날짜 형식을 로케일에 맞게 표시
  const formatDate = (date: Date) => {
    if (locale === 'ko') {
      return dayjs(date).format('YYYY년 MM월 DD일');
    }
    if (locale === 'ja') {
      return dayjs(date).format('YYYY年MM月DD日');
    }
    if (locale === 'zh') {
      return dayjs(date).format('YYYY年MM月DD日');
    }
    return dayjs(date).format('MMMM D, YYYY');
  };

  const displayValue = selected ? formatDate(selected) : '';

  return (
    <div className={className} ref={containerRef}>
      {displayLabel && <label className={labelStyle}>{displayLabel}</label>}

      <div className={'relative'}>
        <button
          type={'button'}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(inputStyle, 'flex cursor-pointer items-center justify-between text-left')}
        >
          <span className={cn(selected ? 'text-main' : 'text-gray6')}>
            {displayValue || t.selectDate || '날짜를 선택하세요'}
          </span>
          <Calendar className={'size-4 text-gray6'} />
        </button>

        {isOpen && (
          <div
            className={
              'animate-slideDown absolute z-50 mt-2 rounded-xl border border-gray7 bg-background p-4 shadow-xl'
            }
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={'mb-3 flex items-center gap-1'}>
              <button
                type={'button'}
                onClick={() => setMonth(dayjs(month).subtract(1, 'month').toDate())}
                className={'shrink-0 size-8 flex items-center justify-center rounded-lg text-sub hover:bg-background-secondary transition-colors'}
              >
                <ChevronLeft className={'size-4'} />
              </button>
              <FormSelect
                value={String(month.getFullYear())}
                onChange={handleYearChange}
                options={years.map((y) => ({ value: String(y), label: `${ y }${ t.year ?? '년' }` }))}
                className={'flex-1'}
              />
              <FormSelect
                value={String(month.getMonth() + 1)}
                onChange={handleMonthChange}
                options={months.map((m) => ({ value: String(m), label: `${ m }${ t.month ?? '월' }` }))}
                className={'flex-1'}
              />
              <button
                type={'button'}
                onClick={() => setMonth(dayjs(month).add(1, 'month').toDate())}
                className={'shrink-0 size-8 flex items-center justify-center rounded-lg text-sub hover:bg-background-secondary transition-colors'}
              >
                <ChevronRight className={'size-4'} />
              </button>
            </div>

            <DayPicker
              mode={'single'}
              selected={selected}
              onSelect={handleSelect}
              month={month}
              onMonthChange={setMonth}
              locale={localeMap[locale as keyof typeof localeMap] || ko}
              startMonth={new Date(1930, 0)}
              endMonth={new Date()}
              showOutsideDays
              fixedWeeks
              classNames={{
                root: 'text-sm',
                months: 'flex flex-col',
                month_caption: 'hidden',
                nav: 'hidden',
                weekdays: 'flex',
                weekday: 'w-9 text-center text-xs font-medium text-sub',
                weeks: 'mt-1',
                week: 'flex',
                day: 'size-9 flex items-center justify-center rounded-lg text-main transition-colors hover:bg-accent2/20',
                day_button: 'size-full cursor-pointer',
                selected: 'bg-accent1 text-white hover:bg-accent1',
                today: 'font-bold text-accent2',
                outside: '!text-gray5',
                disabled: 'text-gray8 cursor-not-allowed',
              }}
            />

            <div className={'mt-3 flex justify-end gap-2'}>
              <button
                type={'button'}
                onClick={() => {
                  setSelected(undefined);
                  setIsOpen(false);
                }}
                className={
                  'rounded-lg px-3 py-1.5 text-sm text-sub transition-colors hover:bg-background-secondary'
                }
              >
                {t.reset || '초기화'}
              </button>
              <button
                type={'button'}
                onClick={() => setIsOpen(false)}
                className={
                  'rounded-lg bg-accent1 px-3 py-1.5 text-sm text-inverse transition-colors hover:opacity-90'
                }
              >
                {t.confirm || '확인'}
              </button>
            </div>
          </div>
        )}
      </div>

      <input type={'hidden'} name={name} value={formatBirthday(selected)} />
      <div className={'mt-1 min-h-4'} />
    </div>
  );
}
