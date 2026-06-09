'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { mockPressData } from '@/lib/mocks/press';
import { useQuery } from '@tanstack/react-query';
import FormSelect from '@/components/ui/FormSelect';
import Pagination from '@/components/ui/Pagination';
import type { Locale } from '@/i18n/config';
import type { PressPost, PressDict } from '@/types/press';
import { cn } from '@/lib/cn';
import { fetchPressList, pressKeys } from '@/lib/queries/press';
import { usePagination } from '@/lib/hooks/usePagination';
import { useSearch } from '@/lib/hooks/useSearch';

interface PressContentProps {
  locale: Locale;
  pressDict: PressDict;
}

function PressCard({ post }: { post: PressPost }) {
  return (
    <a
      href={post.sourceUrl}
      target={'_blank'}
      rel={'noopener noreferrer'}
      className={'group flex flex-col overflow-hidden transition-shadow'}
    >
      <div className={cn(
        'relative w-full aspect-video overflow-hidden rounded-2xl',
        post.thumbnailUrl ? 'bg-gray8' : 'bg-gray9',
      )}
      >
        {post.thumbnailUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className={'absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300'}
          />
        ) : (
          <Image
            src={'/assets/images/no-image.svg'}
            alt={post.title}
            fill
            className={'object-contain p-2'}
          />
        )}
      </div>
      <div className={'flex flex-col gap-1 p-2'}>
        <p className={'text-lg font-bold text-main line-clamp-2'}>
          {post.title}
        </p>
        <div className={'flex items-center justify-between'}>
          <span className={'text-sm text-sub'}>{post.pressName}</span>
          <span className={'text-sm text-gray3'}>
            {dayjs(post.createDate).format('YYYY.MM.DD')}
          </span>
        </div>
      </div>
    </a>
  );
}

export default function PressContent({
  pressDict,
}: PressContentProps) {
  const {
    currentPage, setCurrentPage, itemCount, handleItemCountChange,
  } = usePagination({ defaultItemCount: 12 });

  const {
    searchKeyword, setSearchKeyword, activeQuery, handleSearch, handleSearchKeyDown,
  } = useSearch({ onSearch: () => setCurrentPage(1) });

  // TODO: API 연동 후 useMockData 및 mock 관련 내용 제거
  const useMockData = true;

  const { data: listData, isLoading: loading, isError } = useQuery({
    queryKey: pressKeys.list({
      page: currentPage,
      size: itemCount,
      query: activeQuery || undefined,
    }),
    queryFn: () => fetchPressList({
      page: currentPage,
      size: itemCount,
      query: activeQuery || undefined,
    }),
    enabled: !useMockData,
  });

  const getMockPage = () => {
    const sorted = [...mockPressData].sort(
      (a, b) => dayjs(b.createDate).valueOf() - dayjs(a.createDate).valueOf(),
    );
    const filtered = activeQuery
      ? sorted.filter((p) => p.title.includes(activeQuery) || p.pressName.includes(activeQuery))
      : sorted;
    const start = (currentPage - 1) * itemCount;
    return {
      items: filtered.slice(start, start + itemCount),
      totalPages: Math.ceil(filtered.length / itemCount),
    };
  };

  const mockPage = useMockData ? getMockPage() : null;
  const posts: PressPost[] = useMockData
    ? (mockPage?.items ?? [])
    : (listData?.payload ?? []);
  const totalPages = useMockData
    ? (mockPage?.totalPages ?? 1)
    : (listData?.paging?.totalPages ?? 1);

  return (
    <div>
      {/* 상단 컨트롤: 개수 선택 + 검색 */}
      <div className={'hidden sm:flex items-start sm:items-center justify-between gap-3 mb-6'}>
        <div className={'flex items-center gap-2'}>
          <FormSelect
            value={String(itemCount)}
            onChange={(val) => handleItemCountChange(Number(val))}
            options={[12, 24, 36].map((n) => ({
              value: String(n),
              label: `${ n }${ pressDict.itemsPerPage || '개씩 보기' }`,
            }))}
            className={'py-2 text-sm'}
          />
        </div>

        <div className={'flex items-center gap-2'}>
          <input
            type={'text'}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={pressDict.searchPlaceholder || '검색어를 입력하세요'}
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

      {/* 카드 그리드 */}
      <div
        className={cn(
          'transition-opacity duration-200 min-h-[400px]',
          loading && posts.length > 0 && 'opacity-40 pointer-events-none',
        )}
      >
        {loading && posts.length === 0 ? (
          <div className={'flex items-center justify-center py-20 text-sub'}>
            {pressDict.loading || '불러오는 중...'}
          </div>
        ) : isError ? (
          <div className={'flex items-center justify-center py-20 text-error'}>
            {'서버에 연결할 수 없습니다.'}
          </div>
        ) : posts.length === 0 ? (
          <div className={'flex items-center justify-center py-20 text-sub'}>
            {pressDict.emptyMessage || '게시글이 없습니다.'}
          </div>
        ) : (
          <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'}>
            {posts.map((post) => (
              <PressCard key={post.id} post={post} />
            ))}
          </div>
        )}
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
