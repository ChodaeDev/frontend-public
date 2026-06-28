'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Plus, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import FormSelect from '@/components/ui/FormSelect';
import BoardTable from '@/components/ui/BoardTable';
import Pagination from '@/components/ui/Pagination';
import type { Locale } from '@/i18n/config';
import { useAuthStore } from '@/store/authStore';
import type { Column } from '@/types/ui/boardTable';
import type { BoardDict, BoardPost } from '@/types/board';
import type { SortState } from '@/types/common/sort';
import { cn } from '@/lib/cn';
import { fetchSubMenuBoardList, subMenuBoardKeys, type SubMenuBoardPost } from '@/lib/queries/subMenuBoard';
import { usePagination } from '@/lib/hooks/usePagination';
import { useSearch } from '@/lib/hooks/useSearch';

const sortFieldMap: Record<string, string> = {
  title: 'title',
  date: 'date',
  commentCount: 'commentCount',
};

interface SubMenuBoardContentProps {
  locale: Locale;
  boardDict: BoardDict;
  endpoint: string;
  boardPath: string;
}

export default function SubMenuBoardContent({
  locale,
  boardDict,
  endpoint,
  boardPath,
}: SubMenuBoardContentProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userLevel = user?.level?.toLowerCase();
  const isAdmin = userLevel === 'admin' || userLevel === 'superadmin';

  const { currentPage, setCurrentPage, itemCount, handleItemCountChange } = usePagination();
  const { searchKeyword, setSearchKeyword, activeQuery, handleSearch, handleSearchKeyDown } = useSearch({ onSearch: () => setCurrentPage(1) });
  const [sortState, setSortState] = useState<SortState>({ fieldId: 'date', direction: 'desc' });

  const sortBy = sortFieldMap[sortState.fieldId] ?? 'date';
  const { direction } = sortState;

  const handleSortChange = (sort: SortState) => {
    setSortState(sort);
    setCurrentPage(1);
  };

  const { data: listData, isLoading: loading, isError } = useQuery({
    queryKey: subMenuBoardKeys.list({ page: currentPage, size: itemCount, sort: sortBy, direction, endpoint }),
    queryFn: () => fetchSubMenuBoardList({ page: currentPage, size: itemCount, sort: sortBy, direction, endpoint }),
  });

  const mapPost = (item: SubMenuBoardPost): BoardPost => ({
    id: item.id,
    title: item.title,
    author: item.userName,
    date: dayjs(item.createDate).format('YYYY-MM-DD'),
    commentCount: item.commentCount,
    visibilityLevel: item.visibilityLevel,
    isNotice: item.isNotice,
  });

  const allPosts: BoardPost[] = listData?.items.map(mapPost) ?? [];
  const filtered = activeQuery
    ? allPosts.filter((post) => post.title.toLowerCase().includes(activeQuery.toLowerCase()))
    : allPosts;
  const noticePosts = filtered.filter((post) => post.isNotice);
  const regularPosts = filtered.filter((post) => !post.isNotice);
  const posts = [...noticePosts, ...regularPosts];

  const paging = {
    pageNumber: currentPage,
    totalPages: activeQuery ? 1 : listData?.totalPages ?? 1,
    itemTotal: activeQuery ? regularPosts.length : (listData?.itemTotal ?? 0) - noticePosts.length,
    itemCount,
  };

  const handleRowClick = (post: BoardPost) => {
    router.push(`/${ locale }/${ boardPath }/${ post.id }`);
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
      className: 'justify-start',
      sortable: true,
      accessor: (post) => (
        <span className={'text-main flex items-center gap-1.5'}>
          <div className={'truncate max-w-[160px] sm:max-w-full'}>
            {post.title}
          </div>
          <span className={'text-xs text-accent1 font-medium'}>
            {'['}{post.commentCount ?? 0}{']'}
          </span>
        </span>
      ),
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
  ];

  return (
    <div>
      {isAdmin && (
        <div className={'mb-6'}>
          <Link
            href={`/${ locale }/${ boardPath }/write`}
            className={'inline-flex items-center gap-2 px-5 py-2.5 bg-accent1 text-white rounded-lg hover:bg-accent1/90 transition-colors font-medium'}
          >
            <Plus className={'size-5'} />
            {boardDict.write || '글쓰기'}
          </Link>
        </div>
      )}

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

      <div className={cn('transition-opacity duration-200 min-h-[600px]', loading && posts.length > 0 && 'opacity-40 pointer-events-none')}>
        <BoardTable
          gridClass={'grid-cols-[1fr_96px] sm:grid-cols-[1fr_7fr_1fr_96px]'}
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

      <Pagination
        currentPage={currentPage}
        totalPages={paging.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
