import Link from 'next/link';
import { Lock } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/cn';

export interface BoardPost {
  id: number;
  title: string;
  author: string;
  date: string;
  views?: number;
  commentCount?: number;
  isPrivate?: boolean;
  isNotice?: boolean;
}

interface BoardTableProps {
  posts: BoardPost[];
  loading?: boolean;
  locale: Locale;
  basePath: string;
  itemTotal?: number;
  currentPage?: number;
  itemCount?: number;
  emptyMessage?: string;
  labels: {
    number: string;
    title: string;
    author: string;
    date: string;
    views: string;
    notice?: string;
  };
}

export default function BoardTable({
  posts,
  loading = false,
  locale,
  basePath,
  itemTotal = 0,
  currentPage = 1,
  itemCount = 10,
  emptyMessage = '게시글이 없습니다.',
  labels,
}: BoardTableProps) {
  // 내림차순 번호 계산: 전체 개수 - ((현재 페이지 - 1) * 페이지당 개수) - index
  const getRowNumber = (index: number) => {
    return itemTotal - ((currentPage - 1) * itemCount) - index;
  };

  return (
    <div className={'overflow-x-auto'}>
      <table className={'w-full min-w-[640px]'}>
        <thead>
          <tr className={'border-t-2 border-main bg-gray9'}>
            <th className={'py-3 px-2 text-center text-sm font-semibold text-main w-16'}>
              {labels.number}
            </th>
            <th className={'py-3 px-4 text-left text-sm font-semibold text-main'}>
              {labels.title}
            </th>
            <th className={'py-3 px-2 text-center text-sm font-semibold text-main w-24'}>
              {labels.author}
            </th>
            <th className={'py-3 px-2 text-center text-sm font-semibold text-main w-28'}>
              {labels.date}
            </th>
            <th className={'py-3 px-2 text-center text-sm font-semibold text-main w-16'}>
              {labels.views}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className={'py-12 text-center text-sub'}>
                <span className={'inline-block size-5 border-2 border-gray5 border-t-accent1 rounded-full animate-spin'} />
              </td>
            </tr>
          ) : posts.length === 0 ? (
            <tr>
              <td colSpan={5} className={'py-12 text-center text-sub'}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            posts.map((post, index) => (
              <tr
                key={post.id}
                className={cn('border-b border-gray7 hover:bg-gray9/50 transition-colors', post.isNotice && 'bg-accent1/5')}
              >
                <td className={'py-3.5 px-2 text-center text-sm'}>
                  {post.isNotice ? (
                    <span className={'inline-block px-2 py-0.5 text-xs font-medium text-white bg-accent1 rounded'}>
                      {labels.notice || '공지'}
                    </span>
                  ) : (
                    <span className={'text-sub'}>{getRowNumber(index)}</span>
                  )}
                </td>
                <td className={'py-3.5 px-4'}>
                  <Link
                    href={`/${ locale }${ basePath }/${ post.id }`}
                    className={'text-main hover:text-accent1 transition-colors line-clamp-1 inline-flex items-center gap-1.5'}
                  >
                    {post.isPrivate && <Lock className={'size-3.5 text-gray3 shrink-0'} />}
                    {post.title}
                    <span className={'text-xs text-accent1 font-medium'}>
                      {'['}{post.commentCount ?? 0}{']'}
                    </span>
                  </Link>
                </td>
                <td className={'py-3.5 px-2 text-center text-sm text-sub'}>
                  {post.author}
                </td>
                <td className={'py-3.5 px-2 text-center text-sm text-sub'}>
                  {post.date}
                </td>
                <td className={'py-3.5 px-2 text-center text-sm text-sub'}>
                  {post.views ?? 0}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
