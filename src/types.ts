export type CategoryType = 'tai-lieu' | 'de-thi-hsg' | 'de-thi-tn-thpt';

export type MainNavTab = 'tai-lieu' | 'de-thi';

export type UserRole = 'guest' | 'admin';

export interface DocumentItem {
  id: string;
  title: string;
  summary: string;
  category: CategoryType;
  grade: '10' | '11' | '12' | 'all';
  topic: string;
  difficulty: 'Cơ bản' | 'Vận dụng' | 'Vận dụng cao' | 'Chuyên sâu HSG';
  fileSize: string;
  pages: number;
  downloads: number;
  uploadDate: string;
  tags: string[];
  latexExchangeCode: string;
  pdfUrl: string;
  hasLatex: boolean;
  author: string;
  year?: number;
  tableOfContents?: string[];
  sampleQuestions?: string[];
  // File data for genuine preview & direct download
  fileDataUrl?: string;
  fileName?: string;
  previewPages?: string[];
}

export interface AdminUploadResult {
  title: string;
  summary: string;
  category: CategoryType;
  grade: string;
  topic: string;
  difficulty: string;
  estimatedPages: number;
  tags: string[];
  latexExchangeCode: string;
  tableOfContents?: string[];
  sampleQuestions?: string[];
  previewPages?: string[];
}
