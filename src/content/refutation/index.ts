import type { Article, SeriesInfo } from './types';
import type { Locale } from '@/i18n/config';

// locale별 글 모듈
const articleModules: Record<string, Record<string, Article>> = {
  ko: {},
};

// 한국어 글 등록 (기본)
import ko0001 from './ko/00-01';
import ko0002 from './ko/00-02';
articleModules.ko['00-01'] = ko0001;
articleModules.ko['00-02'] = ko0002;

// TODO: 아래 글들은 로컬 작성 완료, 브랜치 테스트 후 등록 예정
// import ko0003 from './ko/00-03';
// import ko0004 from './ko/00-04';
// import ko0101 from './ko/01-01';
// import ko0102 from './ko/01-02';
// import ko0103 from './ko/01-03';
// import ko0104 from './ko/01-04';
// import ko0105 from './ko/01-05';
// import ko0106 from './ko/01-06';
// import ko0107 from './ko/01-07';
// import ko0201 from './ko/02-01';
// import ko0202 from './ko/02-02';
// import ko0203 from './ko/02-03';
// import ko0204 from './ko/02-04';
// import ko0205 from './ko/02-05';
// import ko0301 from './ko/03-01';
// import ko0302 from './ko/03-02';
// import ko0303 from './ko/03-03';
// import ko0304 from './ko/03-04';
// import ko0305 from './ko/03-05';
// import ko0306 from './ko/03-06';
// import ko0307 from './ko/03-07';
// import ko0401 from './ko/04-01';
// import ko0402 from './ko/04-02';
// import ko0403 from './ko/04-03';
// import ko0404 from './ko/04-04';
// import ko0405 from './ko/04-05';
// import ko0406 from './ko/04-06';
// import ko0501 from './ko/05-01';
// import ko0502 from './ko/05-02';
// import ko0503 from './ko/05-03';
// import ko0504 from './ko/05-04';
// import ko0505 from './ko/05-05';
// import ko0506 from './ko/05-06';
// import ko0507 from './ko/05-07';
// import ko0508 from './ko/05-08';
// import ko0601 from './ko/06-01';
// import ko0602 from './ko/06-02';
// import ko0603 from './ko/06-03';
// import ko0604 from './ko/06-04';
// import ko0605 from './ko/06-05';
// import ko0606 from './ko/06-06';
// import ko0607 from './ko/06-07';
// import ko0608 from './ko/06-08';
// import ko0701 from './ko/07-01';
// import ko0702 from './ko/07-02';
// import ko0703 from './ko/07-03';
// import ko0704 from './ko/07-04';
// import ko0705 from './ko/07-05';
// import ko0706 from './ko/07-06';
// import ko0707 from './ko/07-07';
// import ko0801 from './ko/08-01';
// import ko0802 from './ko/08-02';
// import ko0803 from './ko/08-03';
// import ko0804 from './ko/08-04';
// import ko0805 from './ko/08-05';
// import ko0806 from './ko/08-06';
// import ko0807 from './ko/08-07';
// import ko0808 from './ko/08-08';
// import ko0809 from './ko/08-09';
// import ko0901 from './ko/09-01';
// import ko0902 from './ko/09-02';
// import ko0903 from './ko/09-03';
// import ko0904 from './ko/09-04';
// import ko0905 from './ko/09-05';
// import ko0906 from './ko/09-06';
// import ko0907 from './ko/09-07';
// import ko0908 from './ko/09-08';
// import ko1001 from './ko/10-01';
// import ko1002 from './ko/10-02';
// import ko1003 from './ko/10-03';
// import ko1004 from './ko/10-04';
// import ko1005 from './ko/10-05';
// import ko1006 from './ko/10-06';
// import ko1101 from './ko/11-01';
// import ko1102 from './ko/11-02';
// import ko1103 from './ko/11-03';
// import ko1104 from './ko/11-04';
// import ko1105 from './ko/11-05';
// import ko1106 from './ko/11-06';
// import ko1107 from './ko/11-07';
// import ko1108 from './ko/11-08';
// import ko1109 from './ko/11-09';
// import ko1110 from './ko/11-10';
// articleModules.ko['00-03'] = ko0003;
// articleModules.ko['00-04'] = ko0004;
// articleModules.ko['01-01'] = ko0101;
// ...이하 동일 패턴

// 다른 locale은 파일이 있으면 import, 없으면 ko fallback

export const seriesList: SeriesInfo[] = [
  { number: 0, title: '검증을 시작하며', articleIds: ['00-01', '00-02'] },
  { number: 1, title: '비유풀이의 문제', articleIds: [] },
  { number: 2, title: '창조와 재창조 교리', articleIds: [] },
  { number: 3, title: '시대별 구원자와 약속의 목자', articleIds: [] },
  { number: 4, title: '배도·멸망·구원 교리', articleIds: [] },
  { number: 5, title: '요한계시록 실상 교리', articleIds: [] },
  { number: 6, title: '144,000과 흰 무리', articleIds: [] },
  { number: 7, title: '이만희 총회장에 관한 주장', articleIds: [] },
  { number: 8, title: '예언과 교리 변경', articleIds: [] },
  { number: 9, title: '기독교 핵심 교리와 신천지', articleIds: [] },
  { number: 10, title: '성경 통달과 시험', articleIds: [] },
  { number: 11, title: '신천지에서 자주 하는 반론', articleIds: [] },
];

export function getArticleById(id: string, locale: Locale = 'ko'): Article | undefined {
  return articleModules[locale]?.[id] ?? articleModules.ko[id];
}

export function getAllArticles(locale: Locale = 'ko'): Article[] {
  const koArticles = Object.values(articleModules.ko);
  if (locale === 'ko' || !articleModules[locale]) return koArticles;

  return koArticles.map((koArticle) =>
    articleModules[locale]?.[koArticle.id] ?? koArticle,
  );
}

export function getArticlesBySeries(seriesNumber: number, locale: Locale = 'ko'): Article[] {
  return getAllArticles(locale).filter((a) => a.seriesNumber === seriesNumber);
}

export function getAdjacentArticles(id: string, locale: Locale = 'ko'): { prev: Article | null; next: Article | null } {
  const all = getAllArticles(locale).sort((a, b) => {
    if (a.seriesNumber !== b.seriesNumber) return a.seriesNumber - b.seriesNumber;
    return a.order - b.order;
  });
  const idx = all.findIndex((a) => a.id === id);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
