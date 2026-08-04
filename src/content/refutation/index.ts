import type { Article, SeriesInfo } from './types';
import type { Locale } from '@/i18n/config';

// locale별 글 모듈
const articleModules: Record<string, Record<string, Article>> = {
  ko: {},
};

// 한국어 글 등록 (기본)
import ko0001 from './ko/00-01';
import ko0002 from './ko/00-02';
import ko0003 from './ko/00-03';
import ko0004 from './ko/00-04';
import ko0101 from './ko/01-01';
import ko0102 from './ko/01-02';
import ko0103 from './ko/01-03';
import ko0104 from './ko/01-04';
import ko0105 from './ko/01-05';
import ko0106 from './ko/01-06';
import ko0107 from './ko/01-07';
import ko0201 from './ko/02-01';
import ko0202 from './ko/02-02';
import ko0203 from './ko/02-03';
import ko0204 from './ko/02-04';
import ko0205 from './ko/02-05';
import ko0501 from './ko/05-01';
import ko0502 from './ko/05-02';
import ko0503 from './ko/05-03';
import ko0504 from './ko/05-04';
import ko0505 from './ko/05-05';
import ko0506 from './ko/05-06';
import ko0507 from './ko/05-07';
import ko0508 from './ko/05-08';
import ko0601 from './ko/06-01';
import ko0602 from './ko/06-02';
import ko0603 from './ko/06-03';
import ko0604 from './ko/06-04';
import ko0605 from './ko/06-05';
import ko0606 from './ko/06-06';
import ko0607 from './ko/06-07';
import ko0608 from './ko/06-08';
import ko0701 from './ko/07-01';
import ko0702 from './ko/07-02';
import ko0703 from './ko/07-03';
import ko0704 from './ko/07-04';
import ko0705 from './ko/07-05';
import ko0706 from './ko/07-06';
import ko0707 from './ko/07-07';
import ko0801 from './ko/08-01';
import ko0802 from './ko/08-02';
import ko0803 from './ko/08-03';
import ko0804 from './ko/08-04';
import ko0805 from './ko/08-05';
import ko0806 from './ko/08-06';
import ko0807 from './ko/08-07';
import ko0808 from './ko/08-08';
import ko0809 from './ko/08-09';
import ko0301 from './ko/03-01';
import ko0302 from './ko/03-02';
import ko0303 from './ko/03-03';
import ko0304 from './ko/03-04';
import ko0305 from './ko/03-05';
import ko0306 from './ko/03-06';
import ko0307 from './ko/03-07';
import ko0401 from './ko/04-01';
import ko0402 from './ko/04-02';
import ko0403 from './ko/04-03';
import ko0404 from './ko/04-04';
import ko0405 from './ko/04-05';
import ko0406 from './ko/04-06';
import ko0901 from './ko/09-01';
import ko0902 from './ko/09-02';
import ko0903 from './ko/09-03';
import ko0904 from './ko/09-04';
import ko0905 from './ko/09-05';
import ko0906 from './ko/09-06';
import ko0907 from './ko/09-07';
import ko0908 from './ko/09-08';
import ko1001 from './ko/10-01';
import ko1002 from './ko/10-02';
import ko1003 from './ko/10-03';
import ko1004 from './ko/10-04';
import ko1005 from './ko/10-05';
import ko1006 from './ko/10-06';
import ko1101 from './ko/11-01';
import ko1102 from './ko/11-02';
import ko1103 from './ko/11-03';
import ko1104 from './ko/11-04';
import ko1105 from './ko/11-05';
import ko1106 from './ko/11-06';
import ko1107 from './ko/11-07';
import ko1108 from './ko/11-08';
import ko1109 from './ko/11-09';
import ko1110 from './ko/11-10';
articleModules.ko['00-01'] = ko0001;
articleModules.ko['00-02'] = ko0002;
articleModules.ko['00-03'] = ko0003;
articleModules.ko['00-04'] = ko0004;
articleModules.ko['01-01'] = ko0101;
articleModules.ko['01-02'] = ko0102;
articleModules.ko['01-03'] = ko0103;
articleModules.ko['01-04'] = ko0104;
articleModules.ko['01-05'] = ko0105;
articleModules.ko['01-06'] = ko0106;
articleModules.ko['01-07'] = ko0107;
articleModules.ko['02-01'] = ko0201;
articleModules.ko['02-02'] = ko0202;
articleModules.ko['02-03'] = ko0203;
articleModules.ko['02-04'] = ko0204;
articleModules.ko['02-05'] = ko0205;
articleModules.ko['05-01'] = ko0501;
articleModules.ko['05-02'] = ko0502;
articleModules.ko['05-03'] = ko0503;
articleModules.ko['05-04'] = ko0504;
articleModules.ko['05-05'] = ko0505;
articleModules.ko['05-06'] = ko0506;
articleModules.ko['05-07'] = ko0507;
articleModules.ko['05-08'] = ko0508;
articleModules.ko['06-01'] = ko0601;
articleModules.ko['06-02'] = ko0602;
articleModules.ko['06-03'] = ko0603;
articleModules.ko['06-04'] = ko0604;
articleModules.ko['06-05'] = ko0605;
articleModules.ko['06-06'] = ko0606;
articleModules.ko['06-07'] = ko0607;
articleModules.ko['06-08'] = ko0608;
articleModules.ko['07-01'] = ko0701;
articleModules.ko['07-02'] = ko0702;
articleModules.ko['07-03'] = ko0703;
articleModules.ko['07-04'] = ko0704;
articleModules.ko['07-05'] = ko0705;
articleModules.ko['07-06'] = ko0706;
articleModules.ko['07-07'] = ko0707;
articleModules.ko['08-01'] = ko0801;
articleModules.ko['08-02'] = ko0802;
articleModules.ko['08-03'] = ko0803;
articleModules.ko['08-04'] = ko0804;
articleModules.ko['08-05'] = ko0805;
articleModules.ko['08-06'] = ko0806;
articleModules.ko['08-07'] = ko0807;
articleModules.ko['08-08'] = ko0808;
articleModules.ko['08-09'] = ko0809;
articleModules.ko['03-01'] = ko0301;
articleModules.ko['03-02'] = ko0302;
articleModules.ko['03-03'] = ko0303;
articleModules.ko['03-04'] = ko0304;
articleModules.ko['03-05'] = ko0305;
articleModules.ko['03-06'] = ko0306;
articleModules.ko['03-07'] = ko0307;
articleModules.ko['04-01'] = ko0401;
articleModules.ko['04-02'] = ko0402;
articleModules.ko['04-03'] = ko0403;
articleModules.ko['04-04'] = ko0404;
articleModules.ko['04-05'] = ko0405;
articleModules.ko['04-06'] = ko0406;
articleModules.ko['09-01'] = ko0901;
articleModules.ko['09-02'] = ko0902;
articleModules.ko['09-03'] = ko0903;
articleModules.ko['09-04'] = ko0904;
articleModules.ko['09-05'] = ko0905;
articleModules.ko['09-06'] = ko0906;
articleModules.ko['09-07'] = ko0907;
articleModules.ko['09-08'] = ko0908;
articleModules.ko['10-01'] = ko1001;
articleModules.ko['10-02'] = ko1002;
articleModules.ko['10-03'] = ko1003;
articleModules.ko['10-04'] = ko1004;
articleModules.ko['10-05'] = ko1005;
articleModules.ko['10-06'] = ko1006;
articleModules.ko['11-01'] = ko1101;
articleModules.ko['11-02'] = ko1102;
articleModules.ko['11-03'] = ko1103;
articleModules.ko['11-04'] = ko1104;
articleModules.ko['11-05'] = ko1105;
articleModules.ko['11-06'] = ko1106;
articleModules.ko['11-07'] = ko1107;
articleModules.ko['11-08'] = ko1108;
articleModules.ko['11-09'] = ko1109;
articleModules.ko['11-10'] = ko1110;

// 다른 locale은 파일이 있으면 import, 없으면 ko fallback

export const seriesList: SeriesInfo[] = [
  { number: 0, title: '검증을 시작하며', articleIds: ['00-01', '00-02', '00-03', '00-04'] },
  { number: 1, title: '비유풀이의 문제', articleIds: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'] },
  { number: 2, title: '창조와 재창조 교리', articleIds: ['02-01', '02-02', '02-03', '02-04', '02-05'] },
  { number: 3, title: '시대별 구원자와 약속의 목자', articleIds: ['03-01', '03-02', '03-03', '03-04', '03-05', '03-06', '03-07'] },
  { number: 4, title: '배도·멸망·구원 교리', articleIds: ['04-01', '04-02', '04-03', '04-04', '04-05', '04-06'] },
  { number: 5, title: '요한계시록 실상 교리', articleIds: ['05-01', '05-02', '05-03', '05-04', '05-05', '05-06', '05-07', '05-08'] },
  { number: 6, title: '144,000과 흰 무리', articleIds: ['06-01', '06-02', '06-03', '06-04', '06-05', '06-06', '06-07', '06-08'] },
  { number: 7, title: '이만희 총회장에 관한 주장', articleIds: ['07-01', '07-02', '07-03', '07-04', '07-05', '07-06', '07-07'] },
  { number: 8, title: '예언과 교리 변경', articleIds: ['08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07', '08-08', '08-09'] },
  { number: 9, title: '기독교 핵심 교리와 신천지', articleIds: ['09-01', '09-02', '09-03', '09-04', '09-05', '09-06', '09-07', '09-08'] },
  { number: 10, title: '성경 통달과 시험', articleIds: ['10-01', '10-02', '10-03', '10-04', '10-05', '10-06'] },
  { number: 11, title: '신천지에서 자주 하는 반론', articleIds: ['11-01', '11-02', '11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09', '11-10'] },
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
