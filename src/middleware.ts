import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';

const publicFile = /\.(.*)$/;
const localeCookieName = 'NEXT_LOCALE';

function getLocaleFromRequest(request: NextRequest): Locale {
  // 1. 쿠키에서 언어 설정 확인
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Accept-Language 헤더에서 언어 감지
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(',')
      .map((lang) => {
        const [locale, priority] = lang.trim().split(';q=');
        return {
          locale: locale.split('-')[0], // 'ko-KR' -> 'ko'
          priority: priority ? parseFloat(priority) : 1,
        };
      })
      .sort((a, b) => b.priority - a.priority);

    for (const { locale } of preferredLocales) {
      if (isValidLocale(locale)) {
        return locale;
      }
    }
  }

  // 3. 기본 언어 반환
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // public 파일, api 라우트, _next 경로는 무시
  if (
    pathname.startsWith('/_next')
    || pathname.startsWith('/api')
    || publicFile.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 현재 경로에서 locale 추출
  const pathnameSegments = pathname.split('/');
  const potentialLocale = pathnameSegments[1];

  // 이미 유효한 locale이 있는 경우
  if (isValidLocale(potentialLocale)) {
    const response = NextResponse.next();
    // 쿠키에 현재 locale 저장
    response.cookies.set(localeCookieName, potentialLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1년
      path: '/',
    });
    return response;
  }

  // locale이 없는 경우 리다이렉트
  const detectedLocale = getLocaleFromRequest(request);
  const newUrl = new URL(`/${ detectedLocale }${ pathname }`, request.url);

  // 쿼리 파라미터 유지
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);
  response.cookies.set(localeCookieName, detectedLocale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // Skip all api routes
    // Skip all static files
    '/((?!_next|api|favicon.ico|assets).*)',
  ],
};
