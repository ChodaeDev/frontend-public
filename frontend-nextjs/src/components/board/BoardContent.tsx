'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Plus, Search } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { apiBase, fetchWithAuth } from '@/lib/api';
import BoardTable, { type BoardPost } from './BoardTable';
import Pagination from '@/components/ui/Pagination';
import { cn } from '@/lib/cn';

interface CounselingPost {
  id: number;
  title: string;
  userId: string;
  userName: string;
  commentCount: number;
  isPrivate: number;
  createDate: string;
}

interface PagingInfo {
  pageNumber: number;
  totalPages: number;
  itemTotal: number;
  itemCount: number;
}

interface BoardListResponse {
  status: number;
  paging: PagingInfo;
  payload: CounselingPost[];
}

interface BoardDict {
  requestCounseling: string;
  number: string;
  title: string;
  author: string;
  date: string;
  views: string;
  notice: string;
  emptyMessage: string;
  itemsPerPage: string;
  searchByTitle: string;
  searchByAuthor: string;
  searchPlaceholder: string;
  search: string;
}

export interface BoardContentProps {
  isCounselingBoard: boolean;
  locale: Locale;
  section: string;
  sub: string;
  boardDict: BoardDict;
}

export default function BoardContent({
  isCounselingBoard,
  locale,
  section,
  sub,
  boardDict,
}: BoardContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemCount, setItemCount] = useState(10);
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [itemTotal, setItemTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // 검색 상태
  const [searchType, setSearchType] = useState<'title' | 'author'>('title');
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchPosts = useCallback(async (page: number, count: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        pageNumber: String(page),
        itemCount: String(count),
        pageSize: '10',
      });
      const res = await fetchWithAuth(`${ apiBase }/api/board/${ sub }/list?${ params }`);
      if (!res.ok) throw new Error(`${ res.status }`);

      const data: BoardListResponse = await res.json();
      const mapped: BoardPost[] = data.payload.map((item) => ({
        id: item.id,
        title: item.title,
        author: item.userName,
        userId: item.userId,
        date: dayjs(item.createDate).format('YYYY-MM-DD'),
        commentCount: item.commentCount,
        isPrivate: item.isPrivate,
      }));
      setPosts(mapped);
      setTotalPages(data.paging.totalPages);
      setItemTotal(data.paging.itemTotal);
    } catch {
      setPosts([]);
      setTotalPages(1);
      setItemTotal(0);
    } finally {
      setLoading(false);
    }
  }, [sub]);

  useEffect(() => {
    fetchPosts(currentPage, itemCount);
  }, [currentPage, itemCount, fetchPosts]);

  const handleItemCountChange = (count: number) => {
    setItemCount(count);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    // TODO: API에 검색 파라미터 추가
    fetchPosts(1, itemCount);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div>
      {/* 상담 신청 버튼 (상담게시판인 경우) */}
      {isCounselingBoard && (
        <div className={'mb-6'}>
          <Link
            href={`/${ locale }/board/counseling/write`}
            className={'inline-flex items-center gap-2 px-5 py-2.5 bg-accent1 text-white rounded-lg hover:bg-accent1/90 transition-colors font-medium'}
          >
            <Plus className={'size-5'} />
            {boardDict.requestCounseling || '상담 신청'}
          </Link>
        </div>
      )}

      {/* 게시글 노출 개수 + 검색 */}
      <div className={'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4'}>
        {/* 게시글 노출 개수 드롭다운 */}
        <div className={'flex items-center gap-2'}>
          <select
            value={itemCount}
            onChange={(e) => handleItemCountChange(Number(e.target.value))}
            className={'px-3 py-2 border border-gray6 rounded-lg bg-background text-main text-sm focus:outline-none focus:ring-1 focus:ring-accent1'}
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>{n}{boardDict.itemsPerPage || '개씩 보기'}</option>
            ))}
          </select>
        </div>

        {/* 검색 */}
        <div className={'flex items-center gap-2'}>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'title' | 'author')}
            className={'px-3 py-2 border border-gray6 rounded-lg bg-background text-main text-sm focus:outline-none focus:ring-1 focus:ring-accent1'}
          >
            <option value={'title'}>{boardDict.searchByTitle || '제목'}</option>
            <option value={'author'}>{boardDict.searchByAuthor || '작성자'}</option>
          </select>
          <input
            type={'text'}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={boardDict.searchPlaceholder || '검색어를 입력하세요'}
            className={'px-3 py-2.25 border border-gray6 rounded-lg bg-background text-main text-sm focus:outline-none focus:ring-1 focus:ring-accent1 w-48'}
          />
          <button
            onClick={handleSearch}
            className={'size-10 flex items-center justify-center bg-accent1 text-white rounded-lg hover:bg-accent1/90 transition-colors'}
          >
            <Search className={'size-5'} />
          </button>
        </div>
      </div>

      {/* 게시판 테이블 */}
      <div className={cn('transition-opacity duration-200', loading && posts.length > 0 && 'opacity-40 pointer-events-none')}>
        <BoardTable
          posts={posts}
          loading={loading && posts.length === 0}
          locale={locale}
          basePath={`/${ section }/${ sub }`}
          itemTotal={itemTotal}
          currentPage={currentPage}
          itemCount={itemCount}
          emptyMessage={boardDict.emptyMessage || '게시글이 없습니다.'}
          labels={{
            number: boardDict.number || '번호',
            title: boardDict.title || '제목',
            author: boardDict.author || '작성자',
            date: boardDict.date || '작성일',
            views: boardDict.views || '조회수',
            notice: boardDict.notice || '공지',
          }}
        />
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
