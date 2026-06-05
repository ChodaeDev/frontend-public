import { fetchApi } from '@/lib/api';
import type { VisibilityLevel } from '@/types/board';

export interface FreeBoardListParams {
  page: number;
  size: number;
  sort?: string;
  direction?: string;
  endpoint?: string;
}

export interface FreeBoardPost {
  id: number;
  title: string;
  content?: string;
  userId: string;
  userName: string;
  phone?: string;
  counselType?: string;
  commentCount: number;
  visibilityLevel: VisibilityLevel;
  createDate: string;
  modifiedDate?: string;
}

export interface FreeBoardPagedData {
  items: FreeBoardPost[];
  pageNumber: number;
  pageSize: number;
  itemTotal: number;
  sorting?: string;
  itemCount: number;
  totalPages: number;
}

export const freeBoardKeys = {
  all: ['freeBoard'] as const,
  list: (params: FreeBoardListParams) => [...freeBoardKeys.all, 'list', params] as const,
};

const sortFieldMap: Record<string, string> = {
  title: 'title',
  date: 'regdt',
  commentCount: 'commentcount',
};

export async function fetchFreeBoardList(params: FreeBoardListParams): Promise<FreeBoardPagedData> {
  const { page, size, sort = 'date', direction = 'desc', endpoint = '/api/freeboard/list' } = params;
  const sorting = `${ sortFieldMap[sort] ?? 'regdt' }_${ direction }`;
  const urlParams = new URLSearchParams({
    pageNumber: String(page),
    itemCount: String(size),
    pageSize: '10',
    sorting,
  });

  const { data } = await fetchApi<FreeBoardPagedData>(`${ endpoint }?${ urlParams }`);
  if (!data) throw new Error('게시글을 불러올 수 없습니다.');
  return data;
}
