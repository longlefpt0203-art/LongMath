export type CategoryType = 'tai-lieu' | 'de-thi-hsg' | 'de-thi-tn-thpt';

export type MainNavTab = 'tai-lieu' | 'de-thi';

export type UserRole = 'guest' | 'admin';

export type UploadMode = 'auto' | 'manual';

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
  institution?: string; // Sở GD&ĐT, Trường THPT hoặc Đơn vị ra đề
  examName?: string; // Tên kỳ thi cụ thể (ví dụ: Khảo sát chất lượng, Thi thử tốt nghiệp lần 1...)
  questionCount?: string; // Số lượng câu trong đề (ví dụ: "50 câu trắc nghiệm", "22 câu (Format 2025)", "5 bài tự luận")
  tableOfContents?: string[];
  sampleQuestions?: string[];
  // File data for genuine preview & direct download
  fileDataUrl?: string;
  fileName?: string;
  previewPages?: string[];
  // Google Drive cloud storage link & info
  driveFileUrl?: string;
  driveFileId?: string;
}

export interface AdminUploadResult {
  title: string;
  summary: string;
  category: CategoryType;
  grade: string;
  topic: string;
  difficulty: string;
  estimatedPages: number;
  institution?: string;
  examName?: string;
  questionCount?: string;
  tags: string[];
  latexExchangeCode: string;
  tableOfContents?: string[];
  sampleQuestions?: string[];
  previewPages?: string[];
  fileName?: string;
  fileSize?: string;
}

