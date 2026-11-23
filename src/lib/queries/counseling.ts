import { fetchWithAuth, fetchApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { BoardListResponse, CounselingDetailData, Comment, VisibilityLevel } from '@/types/board';

/** 비회원 글 열람 토큰 헤더 (비밀번호 확인 후 발급, 메모리에만 보관) */
export const guestTokenHeader = 'X-Guest-Post-Token';

/** 백엔드 에러 코드를 보존하는 에러 */
export class CounselingApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'CounselingApiError';
    this.status = status;
    this.code = code;
  }
}

/** 비회원 글이라 비밀번호 확인이 필요한 경우 (토큰 만료 포함) */
export const isGuestPasswordRequired = (err: unknown) =>
  err instanceof CounselingApiError
  && (err.code === 'GUEST_PASSWORD_REQUIRED' || err.code === 'GUEST_TOKEN_EXPIRED');

function guestHeaders(accessToken?: string): Record<string, string> {
  return accessToken ? { [guestTokenHeader]: accessToken } : {};
}

// { success, data, message, code } 응답을 받아 실패 시 code를 담아 throw
// fetchWithAuth는 401이면 무조건 로그아웃시키므로 쓰지 않는다. 비회원 글 에러(GUEST_*)로 회원 세션이 끊기면 안 된다.
async function requestCounseling<T>(url: string, options?: RequestInit, accessToken?: string): Promise<T | undefined> {
  const memberToken = useAuthStore.getState().token;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(memberToken ? { Authorization: `Bearer ${ memberToken }` } : {}),
      ...guestHeaders(accessToken),
      ...options?.headers,
    },
  });

  const text = await res.text();
  let body: { success?: boolean; data?: T; message?: string; code?: string } = {};
  try {
    body = text.trim() ? JSON.parse(text) : {};
  } catch {
    throw new CounselingApiError(`서버 응답을 파싱할 수 없습니다: ${ text.slice(0, 100) }`, res.status);
  }

  if (res.status === 401 && !body.code?.startsWith('GUEST_')) {
    useAuthStore.getState().logout();
  }

  if (!res.ok || body.success === false) {
    throw new CounselingApiError(body.message ?? `서버 오류 (${ res.status })`, res.status, body.code);
  }
  return body.data;
}

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

export async function fetchCounselingDetail(id: number, accessToken?: string): Promise<CounselingDetailData> {
  const data = await requestCounseling<CounselingDetailData>(`/api/board/counseling/detail/${ id }`, undefined, accessToken);
  if (!data) throw new Error('게시글을 찾을 수 없습니다.');
  return data;
}

export async function fetchCounselingComments(id: number, accessToken?: string): Promise<Comment[]> {
  const data = await requestCounseling<Comment[]>(`/api/board/counseling/detail/${ id }/comments`, undefined, accessToken);
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
  accessToken,
}: {
  id: number;
  data: UpdatePostInput;
  accessToken?: string;
}): Promise<void> {
  await requestCounseling(`/api/board/counseling/edit/${ id }`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, accessToken);
}

export async function deleteCounselingPost(id: number, accessToken?: string): Promise<void> {
  await requestCounseling(`/api/board/counseling/delete/${ id }`, {
    method: 'DELETE',
  }, accessToken);
}

// ─── 비회원 상담글 ───────────────────────────────────────────

export interface CreateGuestPostInput {
  title: string;
  counselType: string;
  content: string;
  guestName: string;
  phone: string;
  password: string;
  agreePrivacy: true;
}

export interface CreateGuestPostResult {
  id: number;
}

export async function createGuestCounselingPost(data: CreateGuestPostInput): Promise<CreateGuestPostResult> {
  const result = await requestCounseling<CreateGuestPostResult>('/api/board/counseling/guest/form', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!result) throw new Error('등록 결과를 받지 못했습니다.');
  return result;
}

export interface GuestAccessResult {
  accessToken: string;
  expiresIn: number;
}

export async function verifyGuestPostPassword({
  id,
  password,
}: {
  id: number;
  password: string;
}): Promise<GuestAccessResult> {
  const result = await requestCounseling<GuestAccessResult>(`/api/board/counseling/detail/${ id }/verify-password`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  if (!result) throw new Error('열람 토큰을 받지 못했습니다.');
  return result;
}

/** 비밀번호로 연 비회원 글에서 쓰는 댓글 API (CommentSection의 api prop) */
export function guestCommentApi(postId: number, accessToken: string) {
  const base = `/api/board/counseling/detail/${ postId }/comments`;
  return {
    queryKey: [...counselingKeys.comments(postId), 'guest', accessToken] as const,
    fetchComments: () => fetchCounselingComments(postId, accessToken),
    createComment: async (data: CreateCommentInput) => {
      await requestCounseling(base, { method: 'POST', body: JSON.stringify(data) }, accessToken);
    },
    updateComment: async (commentId: number, data: UpdateCommentInput) => {
      await requestCounseling(`${ base }/${ commentId }`, { method: 'PUT', body: JSON.stringify(data) }, accessToken);
    },
    deleteComment: async (commentId: number) => {
      await requestCounseling(`${ base }/${ commentId }`, { method: 'DELETE' }, accessToken);
    },
  };
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
