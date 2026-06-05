export interface PressPost {
  id: number;
  title: string;
  pressName: string;
  thumbnailUrl: string;
  sourceUrl: string;
  createDate: string;
}

export interface PressListResponse {
  status: number;
  paging: {
    pageNumber: number;
    totalPages: number;
    itemTotal: number;
    itemCount: number;
  };
  payload: PressPost[];
}

export interface PressDict {
  title: string;
  emptyMessage: string;
  pressName: string;
  date: string;
  searchPlaceholder: string;
  itemsPerPage: string;
  loading: string;
}
