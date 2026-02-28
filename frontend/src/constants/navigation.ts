// 네비게이션 아이템 타입 정의
export interface NavItem {
  path: string;
  label: string;
}

// 네비게이션 아이템 설정
export const navItems: NavItem[] = [
  // { path: '/home', label: '홈' },
  { path: '/center', label: '구리이단상담소' },
  { path: '/ministry', label: '목회자' },
  { path: '/counseling/list', label: '상담 신청' },
  // { path: '/shincheonji', label: '신천지 정보' },
  // { path: '/apologetics', label: '교리반증' },
  // { path: '/prevention', label: '피해예방' },
  // { path: '/cases', label: '탈퇴사례' },
];

