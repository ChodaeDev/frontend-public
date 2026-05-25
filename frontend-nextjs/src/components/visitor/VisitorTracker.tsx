'use client';

import { useEffect } from 'react';
import { fetchApi } from '@/lib/api';

const visitorSessionStorageKey = 'chodae_visitor_session_id';

type VisitorIncrementResponse = {
  sessionId: string;
};

export default function VisitorTracker() {
  useEffect(() => {
    let cancelled = false;

    async function recordVisit() {
      try {
        const sessionId = localStorage.getItem(visitorSessionStorageKey);
        const { data } = await fetchApi<VisitorIncrementResponse>('/api/public/visitor/increment', {
          method: 'POST',
          body: JSON.stringify({ sessionId }),
        });

        if (!cancelled && data?.sessionId) {
          localStorage.setItem(visitorSessionStorageKey, data.sessionId);
        }
      } catch (error) {
        console.warn('방문 기록 저장 실패', error);
      }
    }

    void recordVisit();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
