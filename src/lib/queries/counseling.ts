import { fetchWithAuth, fetchApi } from '@/lib/api';
import type { BoardListResponse, CounselingDetailData, Comment, VisibilityLevel } from '@/types/board';

export interface CounselingListParams {
  page: number;
  size: number;
  sort?: string;
  direction?: string;
  query?: string;
}

export interface CounselingListQueryKey extends CounselingListParams {
  userId?: string;
}

export const counselingKeys = {
  all: ['counseling'] as const,
  list: (params: CounselingListQueryKey) =>
    [...counselingKeys.all, 'list', params] as const,
  detail: (id: number) => [...counselingKeys.all, 'detail', id] as const,
  comments: (id: number) => [...counselingKeys.all, 'comments', id] as const,
};

export async function fetchCounselingList(params: CounselingListParams): Promise<BoardListResponse> {
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
    const res = await fetchWithAuth(`/api/board/counseling/search?${ urlParams }`);
    if (!res.ok) throw new Error(`${ res.status }`);
    return res.json();
  }

  const res = await fetchWithAuth(`/api/board/counseling/list?${ urlParams }`);
  if (!res.ok) throw new Error(`${ res.status }`);
  return res.json();
}

export async function fetchCounselingDetail(id: number): Promise<CounselingDetailData> {
  const { data } = await fetchApi<CounselingDetailData>(`/api/board/counseling/detail/${ id }`);
  if (!data) throw new Error('게시글을 찾을 수 없습니다.');
  return data;
}

export async function fetchCounselingComments(id: number): Promise<Comment[]> {
  const { data } = await fetchApi<Comment[]>(`/api/board/counseling/detail/${ id }/comments`);
  return data ?? [];
}

// Mutation input types
export interface CreatePostInput {
  title: string;
  counselType: string;
  content: string;
  phone: string;
  userId: string;
  userName: string;
  visibilityLevel: VisibilityLevel;
}

export interface UpdatePostInput {
  title: string;
  counselType: string;
  content: string;
  phone: string;
  userId: string;
  userName: string;
  visibilityLevel: VisibilityLevel;
}

export interface CreateCommentInput {
  userId: string;
  userName: string;
  content: string;
  parentCommentId?: number | null;
}

export interface UpdateCommentInput {
  userId: string;
  userName: string;
  content: string;
}

// Mutation functions
export async function createCounselingPost(data: CreatePostInput): Promise<void> {
  await fetchApi('/api/board/counseling/form', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCounselingPost({
  id,
  data,
}: {
  id: number;
  data: UpdatePostInput;
}): Promise<void> {
  await fetchApi(`/api/board/counseling/edit/${ id }`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCounselingPost(id: number): Promise<void> {
  await fetchApi(`/api/board/counseling/delete/${ id }`, {
    method: 'DELETE',
  });
}

export async function createComment({
  postId,
  data,
}: {
  postId: number;
  data: CreateCommentInput;
}): Promise<void> {
  await fetchApi(`/api/board/counseling/detail/${ postId }/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateComment({
  postId,
  commentId,
  data,
}: {
  postId: number;
  commentId: number;
  data: UpdateCommentInput;
}): Promise<void> {
  await fetchApi(`/api/board/counseling/detail/${ postId }/comments/${ commentId }`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteComment({
  postId,
  commentId,
}: {
  postId: number;
  commentId: number;
}): Promise<void> {
  await fetchApi(`/api/board/counseling/detail/${ postId }/comments/${ commentId }`, {
    method: 'DELETE',
  });
}
