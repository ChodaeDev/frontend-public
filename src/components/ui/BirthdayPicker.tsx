'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { inputStyle, labelStyle, selectStyle } from './form-styles';
import { getYears, getMonths, formatBirthday } from '@/lib/date';

type BirthdayPickerProps = {
  name?: string;
  label?: string;
  defaultValue?: string;
  className?: string;
};

export function BirthdayPicker({
  name = 'birthday',
  label = '생년월일',
  defaultValue,
  className,
}: BirthdayPickerProps) {
  const [selected, setSelected] = useState<Date | undefined>(() => {
    if (!defaultValue) return undefined;
    const parsed = dayjs(defaultValue);
    return parsed.isValid() ? parsed.toDate() : undefined;
  });
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState<Date>(selected ?? new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const years = getYears(1900);
  const months = getMonths();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    const newMonth = new Date(month);
    newMonth.setFullYear(newYear);
    setMonth(newMonth);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonthIndex = parseInt(e.target.value, 10) - 1;
    const newMonth = new Date(month);
    newMonth.setMonth(newMonthIndex);
    setMonth(newMonth);
  };

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    if (date) {
      setMonth(date);
      setIsOpen(false);
    }
  };

  const displayValue = selected ? dayjs(selected).format('YYYY년 MM월 DD일') : '';

  return (
    <div className={className} ref={containerRef}>
      <label className={labelStyle}>{label}</label>

      <div className={'relative'}>
        <button
          type={'button'}
          onClick={() => setIsOpen(!isOpen)}
          className={`${ inputStyle } flex cursor-pointer items-center justify-between text-left`}
        >
          <span className={selected ? 'text-main' : 'text-gray6'}>
            {displayValue || '날짜를 선택하세요'}
          </span>
          <Calendar className={'size-4 text-gray6'} />
        </button>

        {isOpen && (
          <div
            className={
              'animate-slideDown absolute z-50 mt-2 rounded-xl border border-gray7 bg-background p-4 shadow-xl'
            }
          >
            <div className={'mb-3 flex gap-2'}>
              <select
                value={month.getFullYear()}
                onChange={handleYearChange}
                className={selectStyle}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}{'년'}
                  </option>
                ))}
              </select>
              <select
                value={month.getMonth() + 1}
                onChange={handleMonthChange}
                className={selectStyle}
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}{'월'}
                  </option>
                ))}
              </select>
            </div>

            <DayPicker
              mode={'single'}
              selected={selected}
              onSelect={handleSelect}
              month={month}
              onMonthChange={setMonth}
              locale={ko}
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
                selected: 'bg-accent1 text-inverse hover:bg-accent1',
                today: 'font-bold text-accent2',
                outside: 'text-gray7',
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
                {'초기화'}
              </button>
              <button
                type={'button'}
                onClick={() => setIsOpen(false)}
                className={
                  'rounded-lg bg-accent1 px-3 py-1.5 text-sm text-inverse transition-colors hover:opacity-90'
                }
              >
                {'확인'}
              </button>
            </div>
          </div>
        )}
      </div>

      <input type={'hidden'} name={name} value={formatBirthday(selected)} />
    </div>
  );
}
