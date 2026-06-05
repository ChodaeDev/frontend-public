import { fetchWithAuth } from '@/lib/api';
import type { PressListResponse } from '@/types/press';

export interface PressListParams {
  page: number;
  size: number;
  sort?: string;
  direction?: string;
  query?: string;
}

export const pressKeys = {
  all: ['press'] as const,
  list: (params: PressListParams) =>
    [...pressKeys.all, 'list', params] as const,
};

export async function fetchPressList(params: PressListParams): Promise<PressListResponse> {
  const { page, size, sort = 'createDate', direction = 'desc', query } = params;
  const urlParams = new URLSearchParams({
    pageNumber: String(page),
    itemCount: String(size),
    pageSize: '10',
    sortBy: sort,
    sortDirection: direction,
  });

  if (query) {
    urlParams.set('query', query);
  }

  const res = await fetchWithAuth(`/api/scj-info/press/list?${ urlParams }`);
  if (!res.ok) throw new Error(`${ res.status }`);
  return res.json();
}
