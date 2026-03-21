export const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const response = await fetch(`${ apiBase }${ endpoint }`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
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

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? `서버 오류 (${ response.status })`);
  }

  return data;
}
