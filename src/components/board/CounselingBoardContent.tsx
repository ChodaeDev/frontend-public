'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Plus, Search, Lock } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { apiBase, fetchWithAuth } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import BoardTable, { type Column } from '@/components/ui/BoardTable';
import Pagination from '@/components/ui/Pagination';
import type { Paging } from '@/types/paging';
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

interface BoardListResponse {
  status: number;
  paging: {
    pageNumber: number;
    totalPages: number;
    itemTotal: number;
    itemCount: number;
  };
  payload: CounselingPost[];
}

interface BoardPost {
  id: number;
  title: string;
  author: string;
  userId?: string;
  date: string;
  views?: number;
  commentCount?: number;
  isPrivate?: number;
  isNotice?: boolean;
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

export interface CounselingBoardContentProps {
  locale: Locale;
  boardDict: BoardDict;
}

export default function CounselingBoardContent({
  locale,
  boardDict,
}: CounselingBoardContentProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemCount, setItemCount] = useState(10);
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [itemTotal, setItemTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [searchType, setSearchType] = useState<'title' | 'author'>('title');
  const [searchKeyword, setSearchKeyword] = useState('');

  const isAdmin = user?.userId === 'admin';

  const isLocked = (post: BoardPost) => {
    if (isAdmin || post.userId === user?.userId) return false;
    return true;
  };

  const handleRowClick = (post: BoardPost) => {
    if (isLocked(post)) {
      alert('비공개 글입니다. 작성자만 확인할 수 있습니다.');
      return;
    }
    router.push(`/${ locale }/board/counseling/${ post.id }`);
  };

  const fetchPosts = useCallback(async (page: number, count: number) => {
    setLoading(true);
    setIsError(false);
    try {
      const params = new URLSearchParams({
        pageNumber: String(page),
        itemCount: String(count),
        pageSize: '10',
      });
      const res = await fetchWithAuth(`${ apiBase }/api/board/counseling/list?${ params }`);
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
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const paging: Paging = {
    pageNumber: currentPage,
    totalPages,
    itemTotal,
    itemCount,
  };

  const columns: Column<BoardPost>[] = [
    {
      id: 'number',
      label: boardDict.number || '번호',
      className: 'justify-center',
      accessor: (post, index, paging) => {
        if (post.isNotice) {
          return (
            <span className={'inline-block px-2 py-0.5 text-xs font-medium text-white bg-accent1 rounded'}>
              {boardDict.notice || '공지'}
            </span>
          );
        }
        if (paging) {
          const rowNumber = paging.itemTotal - ((paging.pageNumber - 1) * paging.itemCount) - (index ?? 0);
          return <span className={'text-sub'}>{rowNumber}</span>;
        }
        return null;
      },
    },
    {
      id: 'title',
      label: boardDict.title || '제목',
      accessor: (post) => {
        const locked = isLocked(post);
        return (
          <span className={'text-main flex items-center gap-1.5'}>
            {locked && <Lock className={'size-3.5 text-gray3 shrink-0'} />}
            <div className={'truncate max-w-[100px] sm:max-w-full'}>
              {post.title}
            </div>
            <span className={'text-xs text-accent1 font-medium'}>
              {'['}{post.commentCount ?? 0}{']'}
            </span>
          </span>
        );
      },
    },
    {
      id: 'author',
      label: boardDict.author || '작성자',
      className: 'justify-center',
      accessor: (post) => <span className={'text-sm text-sub'}>{post.author}</span>,
    },
    {
      id: 'date',
      label: boardDict.date || '작성일',
      className: 'justify-center',
      hideOnMobile: true,
      accessor: (post) => <span className={'text-sm text-sub'}>{post.date}</span>,
    },
    {
      id: 'views',
      label: boardDict.views || '조회수',
      className: 'justify-center',
      hideOnMobile: true,
      accessor: (post) => <span className={'text-sm text-sub'}>{post.views ?? 0}</span>,
    },
  ];

  return (
    <div>
      {/* 상담 신청 버튼 */}
      <div className={'mb-6'}>
        <Link
          href={`/${ locale }/board/counseling/write`}
          className={'inline-flex items-center gap-2 px-5 py-2.5 bg-accent1 text-white rounded-lg hover:bg-accent1/90 transition-colors font-medium'}
        >
          <Plus className={'size-5'} />
          {boardDict.requestCounseling || '상담 신청'}
        </Link>
      </div>

      {/* 게시글 노출 개수 + 검색 */}
      <div className={'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4'}>
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
          gridClass={'grid-cols-[64px_1fr_96px] sm:grid-cols-[64px_1fr_96px_112px_64px]'}
          data={posts}
          columns={columns}
          isLoading={loading && posts.length === 0}
          isError={isError}
          paging={paging}
          keyExtractor={(post) => String(post.id)}
          onRowClick={handleRowClick}
          emptyMessage={boardDict.emptyMessage || '게시글이 없습니다.'}
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
