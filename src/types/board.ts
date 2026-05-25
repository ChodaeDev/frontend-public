export interface CounselingPost {
  id: number;
  title: string;
  userName: string;
  isOwner: boolean;
  commentCount: number;
  isPrivate: number;
  counselType: string;
  createDate: string;
}

export interface BoardListResponse {
  status: number;
  paging: {
    pageNumber: number;
    totalPages: number;
    itemTotal: number;
    itemCount: number;
  };
  payload: CounselingPost[];
}

export interface BoardPost {
  id: number;
  title: string;
  author: string;
  isOwner?: boolean;
  date: string;
  views?: number;
  commentCount?: number;
  isPrivate?: number;
  isNotice?: boolean;
  counselType?: string;
}

export interface CounselingDetailData {
  id: number;
  title: string;
  content: string;
  userId: string;
  userName: string;
  phone: string;
  counselType: string;
  commentCount: number;
  isPrivate: number;
  createDate: string;
  modifiedDate: string;
}

export interface Comment {
  id: number;
  userId: string;
  userName: string;
  content: string;
  isPrivate: number;
  confirm: string;
  createDate: string;
}

export interface BoardDict {
  requestCounseling: string;
  number: string;
  title: string;
  author: string;
  date: string;
  views: string;
  notice: string;
  emptyMessage: string;
  itemsPerPage: string;
  searchByTitle: string;
  searchByAuthor: string;
  searchPlaceholder: string;
  search: string;
  counselType?: string;
  counselTypeSelf?: string;
  counselTypeFamily?: string;
  counselTypeFriend?: string;
  counselTypeEtc?: string;
}
