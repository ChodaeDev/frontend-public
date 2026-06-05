import type { ApiResponse } from '@/types/common/api';
import { useAuthStore } from '@/store/authStore';

export type { ApiResponse };

export const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${ token }` } : {};
}

function clearAuthStorage() {
  useAuthStore.getState().logout();
}

// 응답 구조와 관계없이 토큰만 자동 포함하는 fetch 래퍼
export async function fetchWithAuth(url: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });
  if (res.status === 401) {
    clearAuthStorage();
  }
  return res;
}

// { success, data } 형태의 API 응답용
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const response = await fetch(`${ apiBase }${ endpoint }`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  const text = await response.text();

  if (!text.trim()) {
    if (response.ok) {
      throw new Error('서버에서 응답이 없습니다. 서버가 정상적으로 실행 중인지 확인해주세요.');
    }
    throw new Error(`서버 오류 (${ response.status }): ${ response.statusText }`);
  }

  let data: ApiResponse<T>;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`서버 응답을 파싱할 수 없습니다: ${ text.slice(0, 100) }`);
  }

  if (response.status === 401) {
    clearAuthStorage();
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? `서버 오류 (${ response.status })`);
  }

  return data;
}
