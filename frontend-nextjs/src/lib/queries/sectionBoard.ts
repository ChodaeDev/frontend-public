import { fetchApi } from '@/lib/api';
import type { Comment, VisibilityLevel } from '@/types/board';

export interface SectionBoardRoute {
  mainMenu: string;
  subMenu: string;
}

export interface SectionPostInput {
  title: string;
  content: string;
  userId: string;
  userName: string;
  visibilityLevel: VisibilityLevel;
}

export interface SectionBoardDetailData {
  id: number;
  title: string;
  content: string;
  userId: string;
  userName: string;
  isOwner?: boolean;
  commentCount: number;
  visibilityLevel: VisibilityLevel;
  createDate: string;
  modifiedDate?: string;
}

export const sectionBoardKeys = {
  all: ['sectionBoard'] as const,
  board: (route: SectionBoardRoute) => [...sectionBoardKeys.all, route.mainMenu, route.subMenu] as const,
  detail: (route: SectionBoardRoute, id: number) => [...sectionBoardKeys.board(route), 'detail', id] as const,
  comments: (route: SectionBoardRoute, id: number) => [...sectionBoardKeys.board(route), 'comments', id] as const,
};

function basePath(route: SectionBoardRoute) {
  return `/api/${ route.mainMenu }/${ route.subMenu }`;
}

export async function fetchSectionBoardDetail(route: SectionBoardRoute, id: number): Promise<SectionBoardDetailData> {
  const { data } = await fetchApi<SectionBoardDetailData>(`${ basePath(route) }/detail/${ id }`);
  if (!data) throw new Error('게시글을 찾을 수 없습니다.');
  return data;
}

export async function fetchSectionBoardComments(route: SectionBoardRoute, id: number): Promise<Comment[]> {
  const { data } = await fetchApi<Comment[]>(`${ basePath(route) }/detail/${ id }/comments`);
  return data ?? [];
}

export async function createSectionBoardPost(route: SectionBoardRoute, data: SectionPostInput): Promise<void> {
  await fetchApi(`${ basePath(route) }/form`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSectionBoardPost(route: SectionBoardRoute, id: number, data: SectionPostInput): Promise<void> {
  await fetchApi(`${ basePath(route) }/edit/${ id }`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSectionBoardPost(route: SectionBoardRoute, id: number): Promise<void> {
  await fetchApi(`${ basePath(route) }/delete/${ id }`, {
    method: 'DELETE',
  });
}

export async function createSectionBoardComment({
  route,
  postId,
  data,
}: {
  route: SectionBoardRoute;
  postId: number;
  data: { userId: string; userName: string; content: string; parentCommentId?: number | null };
}): Promise<void> {
  await fetchApi(`${ basePath(route) }/detail/${ postId }/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSectionBoardComment({
  route,
  postId,
  commentId,
  data,
}: {
  route: SectionBoardRoute;
  postId: number;
  commentId: number;
  data: { userId: string; userName: string; content: string };
}): Promise<void> {
  await fetchApi(`${ basePath(route) }/detail/${ postId }/comments/${ commentId }`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSectionBoardComment({
  route,
  postId,
  commentId,
}: {
  route: SectionBoardRoute;
  postId: number;
  commentId: number;
}): Promise<void> {
  await fetchApi(`${ basePath(route) }/detail/${ postId }/comments/${ commentId }`, {
    method: 'DELETE',
  });
}
