'use client';

import { ArrowDownNarrowWide, ArrowDownWideNarrow } from 'lucide-react';
import type { Paging } from '@/types/ui/paging';
import type { SortState } from '@/types/common/sort';
import type { Column } from '@/types/ui/boardTable';
import Loading from '@/components/ui/Loading';

export type { Column };

interface BoardTableProps<T> {
  gridClass?: string;
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  isError: boolean;
  paging?: Paging;
  currentSort?: SortState;
  emptyMessage?: string;
  errorMessage?: string;
  selectedIds?: string[];
  onSortChange?: (sort: SortState)=> void;
  keyExtractor: (item: T)=> string;
  onRowClick?: (item: T)=> void;
  onSelectItem?: (id: string, selected: boolean)=> void;
  onSelectAll?: (selected: boolean)=> void;
}

function BoardTable<T>({
  data,
  columns,
  isLoading,
  isError,
  paging,
  onSortChange,
  currentSort,
  keyExtractor,
  emptyMessage = '게시글이 없습니다.',
  errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.',
  onRowClick,
  selectedIds,
  onSelectItem,
  gridClass = 'grid-cols-[repeat(auto-fit,minmax(100px,1fr))]',
}: BoardTableProps<T>) {
  const handleSort = (fieldId: string) => {
    if (!onSortChange) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (currentSort?.fieldId === fieldId) {
      direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    }
    onSortChange({ fieldId, direction });
  };

  const handleSelectItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onSelectItem && selectedIds) {
      onSelectItem(id, !selectedIds.includes(id));
    }
  };

  if (isLoading) {
    return (
      <div className={'flex min-h-[300px] items-center justify-center border-t-2 border-gray5 py-10'}>
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={'flex min-h-[300px] items-center justify-center py-10'}>
        <p className={'text-sm text-sub'}>{errorMessage}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={'flex min-h-[300px] items-center justify-center border-t-2 border-gray5 py-10'}>
        <p className={'text-sm text-sub'}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`min-w-full grid ${ gridClass } border-t-2 border-gray5`}>
      {/* 헤더 */}
      <div className={'contents'}>
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${ column.className ?? 'justify-center' } ${ column.hideOnMobile ? 'hidden sm:flex' : 'flex' } 
              items-center bg-gray9 border-b border-gray7 py-3 px-2 text-sm font-semibold text-main whitespace-nowrap 
              ${ column.sortable ? 'cursor-pointer select-none' : '' }`}
            onClick={() => column.sortable && handleSort(column.id)}
          >
            <div className={'flex items-center gap-1'}>
              {column.label}
              {column.sortable && (
                <span className={'ml-1'}>
                  {currentSort?.fieldId === column.id ? (
                    currentSort.direction === 'asc'
                      ? <ArrowDownNarrowWide className={'size-3.5'} />
                      : <ArrowDownWideNarrow className={'size-3.5'} />
                  ) : (
                    <ArrowDownWideNarrow className={'size-3.5 text-gray4'} />
                  )}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 데이터 행 */}
      {data.map((item, index) => (
        <div
          key={keyExtractor(item)}
          className={`group contents ${ onRowClick ? 'cursor-pointer' : '' }`}
          onClick={() => onRowClick?.(item)}
        >
          {columns.map((column) => (
            <div
              key={`${ keyExtractor(item) }-${ column.id }`}
              className={`${ column.className ?? '' } ${ column.hideOnMobile ? 'hidden sm:flex' : 'flex' } items-center border-b border-gray7 py-3.5 px-2 group-hover:bg-gray9 transition-colors`}
            >
              {column.id === 'select' && selectedIds && onSelectItem ? (
                <input
                  id={`row-select-${ keyExtractor(item) }`}
                  type={'checkbox'}
                  checked={selectedIds.includes(keyExtractor(item))}
                  onChange={(e) => e.stopPropagation()}
                  onClick={(e) => handleSelectItem(e, keyExtractor(item))}
                  className={'size-4'}
                  aria-label={'행 선택'}
                />
              ) : (
                column.accessor(item, index, paging)
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default BoardTable;
