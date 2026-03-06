import dayjs from 'dayjs';

export const currentYear = dayjs().year();

export function getYears(startYear = 1900): number[] {
  return Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i,
  );
}

export function getMonths(): number[] {
  return Array.from({ length: 12 }, (_, i) => i + 1);
}

export function getDaysInMonth(year: number, month: number): number {
  if (!year || !month) return 31;
  return dayjs(`${ year }-${ month }`).daysInMonth();
}

export function formatBirthday(date: Date | undefined): string {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
}

export function parseBirthday(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const parsed = dayjs(dateStr);
  return parsed.isValid() ? parsed.toDate() : undefined;
}
