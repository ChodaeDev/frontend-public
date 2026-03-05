export interface SubMenuItem {
  label: string;
  slug: string;
  description?: string;
}

export interface NavItem {
  label: string;
  slug: string;
  subMenus?: SubMenuItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: '상담소 안내',
    slug: 'about',
    subMenus: [
      {
        label: '상담소 소개',
        slug: 'introduction',
        description: '상담소에 대한 정보와 찾아오시는 길을 안내해 드립니다.',
      },
      {
        label: '피해 가족 유의사항',
        slug: 'family-tips',
        description: '피해 가족분들이 꼭 알아야 할 주의사항을 안내합니다.',
      },
      {
        label: '전국 상담소 안내',
        slug: 'centers',
        description: '전국에 있는 상담소 위치와 연락처를 안내해 드립니다.',
      },
      {
        label: '목회자 소개',
        slug: 'pastor',
        description: '상담소 대표 신현욱 목사님과 김강림 목사님을 소개합니다.',
      },
      {
        label: '인터뷰 및 언론보도',
        slug: 'interviews',
        description: '상담소 관련 인터뷰와 언론보도 자료입니다.',
      },
      {
        label: '동영상 자료',
        slug: 'videos',
        description: '신천지 관련 동영상 자료를 제공합니다.',
      },
    ],
  },
  {
    label: '신천지 정보',
    slug: 'scj-info',
    subMenus: [
      {
        label: '신천지 이력',
        slug: 'history',
        description: '신천지의 설립 배경과 역사를 알아봅니다.',
      },
      {
        label: '신천지 정보',
        slug: 'details',
        description: '신천지의 조직 구조와 운영 방식을 안내합니다.',
      },
      {
        label: '신천지 포교 전략',
        slug: 'strategy',
        description: '신천지의 다양한 포교 수법을 공개합니다.',
      },
      {
        label: '신천지 불법사례',
        slug: 'illegal-cases',
        description: '신천지의 불법적인 활동 사례를 정리했습니다.',
      },
      {
        label: '신천지 언론보도',
        slug: 'press',
        description: '신천지 관련 언론보도 자료 모음입니다.',
      },
    ],
  },
  {
    label: '신천지 교리반증',
    slug: 'doctrine',
    subMenus: [
      {
        label: '거짓 반증',
        slug: 'false-claims',
        description: '신천지 교리의 거짓된 주장을 반증합니다.',
      },
      {
        label: '신천지 실체 참고 자료',
        slug: 'references',
        description: '신천지의 실체를 파악할 수 있는 참고 자료입니다.',
      },
      {
        label: '법적 자료 모음',
        slug: 'legal',
        description: '신천지 관련 법적 판례 및 자료를 제공합니다.',
      },
    ],
  },
  {
    label: '신천지 피해 예방',
    slug: 'prevention',
    subMenus: [
      {
        label: '예방책',
        slug: 'measures',
        description: '신천지 피해를 예방하기 위한 방법을 안내합니다.',
      },
      {
        label: '예방 자료',
        slug: 'resources',
        description: '피해 예방을 위한 교육 자료를 제공합니다.',
      },
      {
        label: '신천지 위치정보',
        slug: 'locations',
        description: '전국 신천지 시설 위치 정보를 공유합니다.',
      },
    ],
  },
  {
    label: '탈퇴사례',
    slug: 'withdrawal',
    subMenus: [
      {
        label: '지혜로운 탈퇴방법',
        slug: 'methods',
        description: '안전하고 현명한 탈퇴 방법을 안내합니다.',
      },
      {
        label: '탈퇴자 수기 및 간증',
        slug: 'testimonies',
        description: '실제 탈퇴자들의 수기와 간증을 공유합니다.',
      },
      {
        label: '신천지 피해사례',
        slug: 'damage-cases',
        description: '신천지로 인한 피해 사례를 정리했습니다.',
      },
      {
        label: '신천지인들에게',
        slug: 'to-members',
        description: '현재 신천지에 있는 분들께 전하는 메시지입니다.',
      },
    ],
  },
  // TODO: 세미나 요청 페이지 담임 목사님과 상의 후 추가 예정
  {
    label: '게시판',
    slug: 'board',
    subMenus: [
      {
        label: '상담게시판',
        slug: 'counseling',
        description: '신천지 관련 상담을 요청할 수 있습니다.',
      },
      {
        label: '자유게시판',
        slug: 'free',
        description: '자유롭게 의견을 나눌 수 있는 공간입니다.',
      },
      // { label: '세미나 요청', slug: 'seminar' },
    ],
  },
];
