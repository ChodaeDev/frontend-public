'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { fetchWithAuth } from '@/lib/api';

export default function AuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const verified = useRef(false);

  useEffect(() => {
    if (!token || verified.current) return;

    let ignore = false;

    (async () => {
      try {
        const res = await fetchWithAuth('/api/auth/verify');
        if (ignore) return;

        if (res.status === 401) {
          // fetchWithAuth가 이미 logout() 호출함
          const locale = pathname.split('/')[1] || 'ko';
          alert('로그인이 만료되었습니다. 다시 로그인해 주세요.');
          router.replace(`/${ locale }/login`);
        } else {
          verified.current = true;
        }
      } catch {
        // 네트워크 오류 등은 무시 (오프라인 상태에서 로그아웃 방지)
      }
    })();

    return () => { ignore = true; };
  }, [token, pathname, router]);

  return null;
}
