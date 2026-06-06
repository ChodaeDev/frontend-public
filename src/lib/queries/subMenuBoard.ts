import { fetchApi } from '@/lib/api';
import type { Comment, VisibilityLevel } from '@/types/board';

export interface SubMenuBoardRoute {
  mainMenu: string;
  subMenu: string;
}

export interface SubMenuPostInput {
  title: string;
  content: string;
  userId: string;
  userName: string;
  visibilityLevel: VisibilityLevel;
}

export interface SubMenuBoardDetailData {
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

export const subMenuBoardKeys = {
  all: ['subMenuBoard'] as const,
  board: (route: SubMenuBoardRoute) => [...subMenuBoardKeys.all, route.mainMenu, route.subMenu] as const,
  detail: (route: SubMenuBoardRoute, id: number) => [...subMenuBoardKeys.board(route), 'detail', id] as const,
  comments: (route: SubMenuBoardRoute, id: number) => [...subMenuBoardKeys.board(route), 'comments', id] as const,
};

function basePath(route: SubMenuBoardRoute) {
  return `/api/${ route.mainMenu }/${ route.subMenu }`;
}

export async function fetchSubMenuBoardDetail(route: SubMenuBoardRoute, id: number): Promise<SubMenuBoardDetailData> {
  const { data } = await fetchApi<SubMenuBoardDetailData>(`${ basePath(route) }/detail/${ id }`);
  if (!data) throw new Error('게시글을 찾을 수 없습니다.');
  return data;
}

export async function fetchSubMenuBoardComments(route: SubMenuBoardRoute, id: number): Promise<Comment[]> {
  const { data } = await fetchApi<Comment[]>(`${ basePath(route) }/detail/${ id }/comments`);
  return data ?? [];
}

export async function createSubMenuBoardPost(route: SubMenuBoardRoute, data: SubMenuPostInput): Promise<void> {
  await fetchApi(`${ basePath(route) }/form`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSubMenuBoardPost(route: SubMenuBoardRoute, id: number, data: SubMenuPostInput): Promise<void> {
  await fetchApi(`${ basePath(route) }/edit/${ id }`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSubMenuBoardPost(route: SubMenuBoardRoute, id: number): Promise<void> {
  await fetchApi(`${ basePath(route) }/delete/${ id }`, {
    method: 'DELETE',
  });
}

export async function createSubMenuBoardComment({
  route,
  postId,
  data,
}: {
  route: SubMenuBoardRoute;
  postId: number;
  data: { userId: string; userName: string; content: string; parentCommentId?: number | null };
}): Promise<void> {
  await fetchApi(`${ basePath(route) }/detail/${ postId }/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSubMenuBoardComment({
  route,
  postId,
  commentId,
  data,
}: {
  route: SubMenuBoardRoute;
  postId: number;
  commentId: number;
  data: { userId: string; userName: string; content: string };
}): Promise<void> {
  await fetchApi(`${ basePath(route) }/detail/${ postId }/comments/${ commentId }`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSubMenuBoardComment({
  route,
  postId,
  commentId,
}: {
  route: SubMenuBoardRoute;
  postId: number;
  commentId: number;
}): Promise<void> {
  await fetchApi(`${ basePath(route) }/detail/${ postId }/comments/${ commentId }`, {
    method: 'DELETE',
  });
}
