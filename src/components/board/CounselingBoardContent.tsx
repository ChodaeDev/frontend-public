'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Plus, Search, Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import FormSelect from '@/components/ui/FormSelect';
import type { Locale } from '@/i18n/config';
import { useAuthStore } from '@/store/authStore';
import BoardTable from '@/components/ui/BoardTable';
import Pagination from '@/components/ui/Pagination';
import type { Column } from '@/types/ui/boardTable';
import type { BoardPost, BoardDict, CounselingPost } from '@/types/board';
import type { SortState } from '@/types/common/sort';
import { cn } from '@/lib/cn';
import { counselingKeys, fetchCounselingList } from '@/lib/queries/counseling';
import { usePagination } from '@/lib/hooks/usePagination';
import { useSearch } from '@/lib/hooks/useSearch';

const sortFieldMap: Record<string, string> = {
  title: 'title',
  counselType: 'counselType',
  date: 'createDate',
  views: 'views',
};

export interface CounselingBoardContentProps {
  locale: Locale;
  boardDict: BoardDict;
}

export default function CounselingBoardContent({
  locale,
  boardDict,
}: CounselingBoardContentProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userLevel = user?.level?.toLowerCase();
  const isAdmin = userLevel === 'admin' || userLevel === 'superadmin';

  const { currentPage, setCurrentPage, itemCount, handleItemCountChange } = usePagination();
  const { searchKeyword, setSearchKeyword, activeQuery, handleSearch, handleSearchKeyDown } = useSearch({ onSearch: () => setCurrentPage(1) });
  const [sortState, setSortState] = useState<SortState>({ fieldId: 'date', direction: 'desc' });

  const sortBy = sortFieldMap[sortState.fieldId] ?? 'createDate';
  const { direction } = sortState;

  const handleSortChange = (sort: SortState) => {
    setSortState(sort);
    setCurrentPage(1);
  };

  const { data: listData, isLoading: loading, isError } = useQuery({
    queryKey: counselingKeys.list({ page: currentPage, size: itemCount, sort: sortBy, direction, query: activeQuery || undefined, userId: user?.userId }),
    queryFn: () => fetchCounselingList({ page: currentPage, size: itemCount, sort: sortBy, direction, query: activeQuery || undefined }),
  });

  const mapPost = (item: CounselingPost): BoardPost => ({
    id: item.id,
    title: item.title,
    author: item.userId,
    isOwner: item.isOwner,
    date: dayjs(item.createDate).format('YYYY-MM-DD'),
    commentCount: item.commentCount,
    visibilityLevel: item.visibilityLevel,
    isNotice: item.isNotice,
    counselType: item.counselType,
  });

  const allPosts: BoardPost[] = listData?.payload.map(mapPost) ?? [];
  const noticePosts = allPosts.filter((post) => post.isNotice);
  const regularPosts = allPosts.filter((post) => !post.isNotice);
  const posts = [...noticePosts, ...regularPosts];

  const paging = {
    pageNumber: currentPage,
    totalPages: listData?.paging.totalPages ?? 1,
    itemTotal: (listData?.paging.itemTotal ?? 0) - noticePosts.length,
    itemCount,
  };

  // 자물쇠 표시: 공지와 admin 제외 모든 글에 표시
  const showLock = (post: BoardPost) => !post.isNotice && !isAdmin;

  // 진입 가능: 공지, 본인글, admin만 진입 가능
  const canAccess = (post: BoardPost) => post.isNotice || post.isOwner || isAdmin;

  const handleRowClick = (post: BoardPost) => {
    if (!canAccess(post)) {
      alert('비공개 글입니다. 작성자만 확인할 수 있습니다.');
      return;
    }
    router.push(`/${ locale }/board/counseling/${ post.id }`);
  };

  const columns: Column<BoardPost>[] = [
    {
      id: 'number',
      label: boardDict.number || '순번',
      className: 'justify-center',
      hideOnMobile: true,
      accessor: (post, index, paging) => {
        if (post.isNotice) {
          return (
            <span className={'inline-block px-2 py-0.5 text-xs font-medium text-white bg-accent1 rounded shrink-0'}>
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
      className: 'justify-start',
      sortable: true,
      accessor: (post) => (
        <span className={'text-main flex items-center gap-1.5'}>
          {showLock(post) && <Lock className={'size-3.5 text-gray3 shrink-0'} />}
          {!post.isNotice && post.isOwner && !isAdmin && (
            <span className={'shrink-0 px-1.5 py-0.5 text-[10px] font-medium text-main bg-accent4 rounded-full'}>
              {boardDict.ownPost || '본인글'}
            </span>
          )}
          <div className={'truncate max-w-[calc(100vw-190px)] sm:max-w-full'}>
            {post.title}
          </div>
          <span className={'text-xs text-accent1 font-medium'}>
            {'['}{post.commentCount ?? 0}{']'}
          </span>
        </span>
      ),
    },
    {
      id: 'counselType',
      label: boardDict.counselType || '상담유형',
      className: 'justify-center',
      hideOnMobile: true,
      sortable: true,
      accessor: (post) => {
        if (post.isNotice) {
          return <span className={'text-sm font-medium text-accent1'}>{boardDict.notice || '공지'}</span>;
        }
        const counselTypeMap: Record<string, string> = {
          self: boardDict.counselTypeSelf?.split(' ')[0] || '본인',
          family: boardDict.counselTypeFamily?.split(' ')[0] || '가족',
          friend: boardDict.counselTypeFriend?.split(' ')[0] || '지인',
          etc: boardDict.counselTypeEtc?.split(' ')[0] || '기타',
        };
        return (
          <span className={'text-sm text-sub'}>
            {post.counselType ? (counselTypeMap[post.counselType] ?? post.counselType) : '-'}
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
      sortable: true,
      accessor: (post) => <span className={'text-sm text-sub'}>{post.date}</span>,
    },
    // TODO: 조회수 기능 구현 후 복구
    // {
    //   id: 'views',
    //   label: boardDict.views || '조회수',
    //   className: 'justify-center',
    //   hideOnMobile: true,
    //   sortable: true,
    //   accessor: (post) => <span className={'text-sm text-sub'}>{post.views ?? 0}</span>,
    // },
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
      <div className={'hidden sm:flex items-start sm:items-center justify-between gap-3 mb-4'}>
        <div className={'flex items-center gap-2'}>
          <FormSelect
            value={String(itemCount)}
            onChange={(val) => handleItemCountChange(Number(val))}
            options={[10, 20, 30, 50].map((n) => ({ value: String(n), label: `${ n }${ boardDict.itemsPerPage || '개씩 보기' }` }))}
            className={'py-2 text-sm'}
          />
        </div>

        <div className={'flex items-center gap-2'}>
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
      {/* TODO: 조회수 기능 구현 후 gridClass를 sm:grid-cols-[64px_1fr_96px_96px_112px_64px] 으로 변경 */}
      <div className={cn('transition-opacity duration-200 min-h-[600px]', loading && posts.length > 0 && 'opacity-40 pointer-events-non')}>
        <BoardTable
          gridClass={'grid-cols-[1fr_96px] sm:grid-cols-[1fr_6fr_1fr_1fr_96px]'}
          data={posts}
          columns={columns}
          isLoading={loading && posts.length === 0}
          isError={isError}
          paging={paging}
          keyExtractor={(post) => String(post.id)}
          onRowClick={handleRowClick}
          emptyMessage={boardDict.emptyMessage || '게시글이 없습니다.'}
          currentSort={sortState}
          onSortChange={handleSortChange}
          rowClassName={(post) => post.isNotice ? 'bg-accent1/5 group-hover:bg-accent1/10' : ''}
        />
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={paging.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
