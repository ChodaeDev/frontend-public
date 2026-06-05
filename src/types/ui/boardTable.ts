import { ReactNode } from 'react';
import type { Paging } from '@/types/ui/paging';

export interface Column<T> {
  id: string;
  label: string;
  accessor: (item: T, index?: number, paging?: Paging)=> ReactNode;
  className?: string;
  sortable?: boolean;
  hideOnMobile?: boolean;
}
