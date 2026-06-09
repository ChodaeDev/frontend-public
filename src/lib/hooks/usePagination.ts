'use client';

import { useState } from 'react';

interface UsePaginationOptions {
  defaultItemCount?: number;
}

export function usePagination({ defaultItemCount = 10 }: UsePaginationOptions = {}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemCount, setItemCount] = useState(defaultItemCount);

  const handleItemCountChange = (count: number) => {
    setItemCount(count);
    setCurrentPage(1);
  };

  return {
    currentPage,
    setCurrentPage,
    itemCount,
    handleItemCountChange,
  };
}
