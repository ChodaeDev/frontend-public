export interface ArticleSource {
  name: string;
  author?: string;
  date?: string;
  location?: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

export interface Article {
  id: string;
  seriesNumber: number;
  seriesTitle: string;
  order: number;
  title: string;
  description: string;
  content: string;
  selfCheckQuestions: string[];
  relatedArticles: string[];
  sources: ArticleSource[];
  createdDate: string;
  modifiedDate: string;
}

export interface SeriesInfo {
  number: number;
  title: string;
  articleIds: string[];
}
