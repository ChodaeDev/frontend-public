'use client';

import { useState } from 'react';

interface UseSearchOptions {
  onSearch?: ()=> void;
}

export function useSearch({ onSearch }: UseSearchOptions = {}) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeQuery, setActiveQuery] = useState('');

  const handleSearch = () => {
    setActiveQuery(searchKeyword.trim());
    onSearch?.();
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return {
    searchKeyword,
    setSearchKeyword,
    activeQuery,
    handleSearch,
    handleSearchKeyDown,
  };
}
