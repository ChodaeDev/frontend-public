'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number)=> void;
  siblingCount?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 2,
}: PaginationProps) {
  // 페이지 범위 계산
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      // 왼쪽에 더 많은 페이지 표시
      const leftItemCount = 3 + (2 * siblingCount);
      for (let i = 1; i <= Math.min(leftItemCount, totalPages); i++) {
        pages.push(i);
      }
      if (totalPages > leftItemCount) {
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    } else if (showLeftEllipsis && !showRightEllipsis) {
      // 오른쪽에 더 많은 페이지 표시
      const rightItemCount = 3 + (2 * siblingCount);
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - rightItemCount + 2; i <= totalPages; i++) {
        if (i > 1) pages.push(i);
      }
    } else if (showLeftEllipsis && showRightEllipsis) {
      // 양쪽에 ellipsis
      pages.push(1);
      pages.push('ellipsis');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    } else {
      // ellipsis 없음
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pages = getPageNumbers();

  const buttonBaseClass = `
    flex items-center justify-center size-9 rounded-lg transition-colors
    disabled:opacity-40 disabled:cursor-not-allowed
  `;

  const pageButtonClass = (isActive: boolean) => `
    ${ buttonBaseClass }
    ${ isActive
        ? 'bg-accent1 text-white font-medium'
        : 'text-sub hover:bg-gray8 hover:text-main'
    }
  `;

  return (
    <nav aria-label={'Pagination'} className={'flex items-center justify-center gap-1 mt-8'}>
      {/* 처음으로 */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`${ buttonBaseClass } text-sub ${ currentPage === 1 ? '' : 'hover:bg-gray8 hover:text-main' }`}
        aria-label={'First page'}
      >
        <ChevronsLeft className={'size-4'} />
      </button>

      {/* 이전 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${ buttonBaseClass } text-sub ${ currentPage === 1 ? 'bg-background opacity-40 cursor-not-allowed' : 'hover:bg-gray8 hover:text-main' }`}
        aria-label={'Previous page'}
      >
        <ChevronLeft className={'size-4'} />
      </button>

      {/* 페이지 번호 */}
      <div className={'flex items-center gap-1 mx-2'}>
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${ index }`} className={'px-2 text-sub'}>
              {'...'}
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={pageButtonClass(currentPage === page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ),
        )}
      </div>

      {/* 다음 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${ buttonBaseClass } text-sub ${ currentPage === totalPages ? 'bg-background opacity-40 cursor-not-allowed' : 'hover:bg-gray8 hover:text-main' }`}
        aria-label={'Next page'}
      >
        <ChevronRight className={'size-4'} />
      </button>

      {/* 마지막으로 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`${ buttonBaseClass } text-sub ${ currentPage === totalPages ? 'bg-background opacity-40 cursor-not-allowed' : 'hover:bg-gray8 hover:text-main' }`}
        aria-label={'Last page'}
      >
        <ChevronsRight className={'size-4'} />
      </button>
    </nav>
  );
}
