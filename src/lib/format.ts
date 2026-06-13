/**
 * 숫자만 추출한다.
 * "010-1234-5678" → "01012345678"
 */
export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * 전화번호를 하이픈 포맷으로 변환한다.
 * "01012345678" → "010-1234-5678"
 * "0212345678"  → "02-1234-5678"
 */
export function formatPhone(value: string): string {
  const digits = stripNonDigits(value);

  // 9자리: 00-000-0000
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${ digits.slice(0, 2) }-${ digits.slice(2) }`;
  if (digits.length <= 9) return `${ digits.slice(0, 2) }-${ digits.slice(2, 5) }-${ digits.slice(5) }`;

  // 10자리: 000-000-0000
  if (digits.length <= 10) return `${ digits.slice(0, 3) }-${ digits.slice(3, 6) }-${ digits.slice(6) }`;

  // 11자리: 000-0000-0000
  return `${ digits.slice(0, 3) }-${ digits.slice(3, 7) }-${ digits.slice(7, 11) }`;
}
