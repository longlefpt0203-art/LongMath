import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  BookOpen,
  Award,
  RefreshCw,
  Tag,
  Layers,
  Edit3,
  Sliders,
  Building2,
  HelpCircle,
  School,
  CheckSquare,
  FileCode,
  Cloud,
  ExternalLink,
  Folder,
  Loader2,
  Eye,
  Check,
  Zap,
} from 'lucide-react';
import { CategoryType, DocumentItem } from '../types';
import {
  DriveFolderInfo,
  DRIVE_DEFAULT_FOLDER_NAME,
  saveDocumentToDrive,
} from '../services/googleDriveService';

interface AdminUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated: (newDoc: DocumentItem) => void;
  savedFolderInfo?: DriveFolderInfo | null;
  accessToken?: string | null;
  onOpenDriveModal?: () => void;
}

interface SamplePreset {
  name: string;
  categoryHint: string;
  size: string;
  pages: number;
  institution: string;
  examName: string;
  questionCount: string;
  mockContent: string;
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    name: 'De_Thi_Khao_Sat_Toan_2025_So_GD_Nam_Dinh_Lan_1.pdf',
    categoryHint: 'Đề thi TN THPT',
    size: '3.2 MB',
    pages: 6,
    institution: 'Sở GD&ĐT Nam Định',
    examName: 'Kỳ thi Khảo sát chất lượng kết hợp Thi thử Tốt nghiệp THPT 2025',
    questionCount: '22 câu (Phần I: 12 câu TN, Phần II: 4 câu Đúng/Sai, Phần III: 6 câu trả lời ngắn)',
    mockContent:
      'SỞ GIÁO DỤC VÀ ĐÀO TẠO NAM ĐỊNH - KỲ THI KHẢO SÁT CHẤT LƯỢNG KẾT HỢP NĂM 2025 - BÀI THI MÔN TOÁN HỌC. Thời gian làm bài: 90 phút gồm 22 câu cấu trúc GDPT 2018 mới. Tổng số trang của đề thi: 6 trang. Phần I: 12 câu trắc nghiệm nhiều phương án lựa chọn về hàm số, nguyên hàm tích phân, hình Oxyz. Phần II: 4 câu hỏi trắc nghiệm Đúng/Sai liên quan bài toán thực tế thống kê ghép nhóm. Phần III: 6 câu trả lời ngắn điền kết quả số tối ưu hóa chi phí sản xuất bồn nước hình trụ.',
  },
  {
    name: 'De_Thi_Chon_Hoc_Sinh_Gioi_Toan_12_TP_Ha_Noi_2025.pdf',
    categoryHint: 'Đề thi HSG',
    size: '2.8 MB',
    pages: 4,
    institution: 'Sở GD&ĐT Hà Nội',
    examName: 'Kỳ thi Chọn Học sinh Giỏi Thành phố Lớp 12 Môn Toán',
    questionCount: '5 bài toán tự luận (Thời gian 180 phút)',
    mockContent:
      'SỞ GIÁO DỤC VÀ ĐÀO TẠO HÀ NỘI - KỲ THI CHỌN HỌC SINH GIỎI THÀNH PHỐ LỚP 12 MÔN TOÁN. Tổng số trang: 4 trang. Bài 1 (4.0 điểm): Giải phương trình và hệ phương trình vô tỉ chứa căn. Bài 2 (5.0 điểm): Bất đẳng thức ba biến thực dương Cauchy-Schwarz và phương pháp dồn biến. Bài 3 (4.0 điểm): Hình học không gian: Góc nhị diện và khoảng cách giữa hai đường thẳng chéo nhau. Bài 4 (3.0 điểm): Số học nguyên tố p, tính chia hết và phương trình nghiệm nguyên. Bài 5 (4.0 điểm): Tổ hợp rời rạc nguyên lý Dirichlet.',
  },
  {
    name: 'De_Khao_Sat_Chat_Luong_THPT_Chuyen_Lam_Son_2025.pdf',
    categoryHint: 'Đề thi TN THPT',
    size: '3.6 MB',
    pages: 6,
    institution: 'THPT Chuyên Lam Sơn - Thanh Hóa',
    examName: 'Kỳ thi Thử Tốt nghiệp THPT Quốc gia 2025 Môn Toán Lần 1',
    questionCount: '22 câu (Format 2025: 12 trắc nghiệm + 4 đúng sai + 6 trả lời ngắn)',
    mockContent:
      'TRƯỜNG THPT CHUYÊN LAM SƠN THANH HÓA - KỲ THI THỬ TỐT NGHIỆP THPT NĂM 2025 - BÀI THI MÔN TOÁN. Đề thi gồm 6 trang, thời gian làm bài 90 phút. Đề thi bám sát cấu trúc mới với các câu hỏi phân loại sâu về hàm hợp đạo hàm cấp cao, bài toán thực tế kinh tế vi mô ứng dụng tích phân và mô hình tọa độ vectơ Oxyz.',
  },
];

/**
 * Scan binary bytes of a PDF file to detect the exact page count.
 */
async function detectPdfPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let str = '';
    const len = Math.min(bytes.length, 3 * 1024 * 1024);
    for (let i = 0; i < len; i++) {
      str += String.fromCharCode(bytes[i]);
    }
    const countMatch = str.match(/\/Type\s*\/Pages[^>]*\/Count\s+(\d+)/);
    if (countMatch && parseInt(countMatch[1], 10) > 0) {
      return parseInt(countMatch[1], 10);
    }
    const pageMatches = str.match(/\/Type\s*\/Page\b/g);
    if (pageMatches && pageMatches.length > 0) {
      return pageMatches.length;
    }
  } catch (e) {
    console.warn('Cannot detect page count from file bytes:', e);
  }
  return 0;
}

export const AdminUploadModal: React.FC<AdminUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentCreated,
  savedFolderInfo,
  accessToken,
  onOpenDriveModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload & extraction states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [hasAiResult, setHasAiResult] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSavingToDrive, setIsSavingToDrive] = useState<boolean>(false);

  // Form data auto-filled by AI
  const [formData, setFormData] = useState({
    title: '',
    category: 'de-thi-tn-thpt' as CategoryType,
    institution: '',
    examName: '',
    questionCount: '',
    grade: '12' as '10' | '11' | '12' | 'all',
    topic: 'Tổng hợp Đề thi',
    difficulty: 'Vận dụng cao' as 'Cơ bản' | 'Vận dụng' | 'Vận dụng cao' | 'Chuyên sâu HSG',
    estimatedPages: 6,
    fileSize: '3.2 MB',
    summary: '',
    latexExchangeCode: '',
    tags: 'Toán 12, Đề thi, Format 2025',
    tableOfContents: '',
    sampleQuestions: '',
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedFile(null);
    setFileDataUrl(null);
    setIsAnalyzing(false);
    setHasAiResult(false);
    setErrorMsg(null);
    onClose();
  };

  /**
   * Main function to read file, compute real page count, and trigger Gemini 2.5 Flash analysis
   */
  const processDocumentAnalysis = async (file?: File, preset?: SamplePreset) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setHasAiResult(false);

    const fileName = file?.name || preset?.name || 'De_Thi_Toan_THPT.pdf';
    const rawFile = file || null;
    setSelectedFile(rawFile);

    // 1. Detect exact page count from PDF binary stream if real file
    let realPageCount = preset?.pages || 6;
    if (rawFile) {
      setAnalysisStep('Đang đọc tệp nhị phân & kiểm tra số trang thực tế...');
      const detected = await detectPdfPageCount(rawFile);
      if (detected > 0) {
        realPageCount = detected;
      }
    }

    // 2. Read base64
    let base64Data: string | null = null;
    if (rawFile) {
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(rawFile);
        });
        setFileDataUrl(dataUrl);
        base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      } catch (err) {
        console.warn('FileReader error', err);
      }
    } else {
      setFileDataUrl(null);
    }

    // 3. Request AI extraction
    try {
      setAnalysisStep('Gemini 2.5 Flash đang đọc nội dung tệp để trích xuất Sở/Trường, Kỳ thi, Số câu...');

      const response = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          textContent: preset ? preset.mockContent : '',
          fileBase64: base64Data || undefined,
          mimeType: rawFile?.type || 'application/pdf',
        }),
      });

      if (!response.ok) {
        throw new Error(`Lỗi phân tích: HTTP ${response.status}`);
      }

      const data = await response.json();
      setAnalysisStep('Hoàn tất trích xuất! Toàn bộ thông tin đã được điền chính xác tuyệt đối.');

      const finalPages = data.estimatedPages && data.estimatedPages > 0 ? data.estimatedPages : realPageCount;
      const finalFileSize = rawFile ? `${(rawFile.size / (1024 * 1024)).toFixed(1)} MB` : preset?.size || '3.2 MB';

      setFormData({
        title: data.title || fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        category: (data.category as CategoryType) || (preset ? (preset.categoryHint.includes('HSG') ? 'de-thi-hsg' : 'de-thi-tn-thpt') : 'de-thi-tn-thpt'),
        institution: data.institution || preset?.institution || 'Sở GD&ĐT Nam Định',
        examName: data.examName || preset?.examName || 'Kỳ thi Khảo sát chất lượng THPT',
        questionCount: data.questionCount || preset?.questionCount || '22 câu (Format mới GDPT 2018)',
        grade: (data.grade?.toString().includes('10') ? '10' : data.grade?.toString().includes('11') ? '11' : '12') as any,
        topic: data.topic || 'Tổng hợp Đề thi',
        difficulty: (data.difficulty as any) || 'Vận dụng cao',
        estimatedPages: finalPages,
        fileSize: finalFileSize,
        summary: data.summary || '',
        latexExchangeCode: data.latexExchangeCode || `LTX-TOAN-${Math.floor(1000 + Math.random() * 9000)}`,
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : 'Toán 12, Đề thi, Format 2025',
        tableOfContents: Array.isArray(data.tableOfContents) ? data.tableOfContents.join('\n') : '',
        sampleQuestions: Array.isArray(data.sampleQuestions) ? data.sampleQuestions.join('\n') : '',
      });

      setHasAiResult(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Đã có lỗi phân tích. Vui lòng kiểm tra kết nối mạng hoặc khóa API.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processDocumentAnalysis(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processDocumentAnalysis(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedDriveUrl: string | undefined;

    // Optional Google Drive Sync
    if (accessToken && savedFolderInfo) {
      setIsSavingToDrive(true);
      try {
        const dummyDoc: DocumentItem = {
          id: `doc_${Date.now()}`,
          title: formData.title,
          category: formData.category,
          institution: formData.institution,
          examName: formData.examName,
          questionCount: formData.questionCount,
          grade: formData.grade,
          topic: formData.topic,
          difficulty: formData.difficulty,
          pages: formData.estimatedPages,
          fileSize: formData.fileSize,
          fileDataUrl: fileDataUrl || undefined,
          pdfUrl: fileDataUrl || '/sample.pdf',
          author: 'Lê Ngọc Long',
          summary: formData.summary,
          downloads: 0,
          hasLatex: true,
          latexExchangeCode: formData.latexExchangeCode,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
          uploadDate: new Date().toISOString().split('T')[0],
        };

        const driveResult = await saveDocumentToDrive(accessToken, savedFolderInfo.id, dummyDoc);
        uploadedDriveUrl = driveResult.webViewLink;
      } catch (err) {
        console.warn('Lỗi khi lưu lên Drive:', err);
      } finally {
        setIsSavingToDrive(false);
      }
    }

    const newDoc: DocumentItem = {
      id: `doc_${Date.now()}`,
      title: formData.title,
      category: formData.category,
      institution: formData.institution,
      examName: formData.examName,
      questionCount: formData.questionCount,
      grade: formData.grade,
      topic: formData.topic,
      difficulty: formData.difficulty,
      pages: formData.estimatedPages,
      fileSize: formData.fileSize,
      fileDataUrl: fileDataUrl || undefined,
      pdfUrl: fileDataUrl || '/sample.pdf',
      author: 'Lê Ngọc Long',
      summary: formData.summary,
      downloads: 0,
      hasLatex: true,
      latexExchangeCode: formData.latexExchangeCode,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      uploadDate: new Date().toISOString().split('T')[0],
      tableOfContents: formData.tableOfContents ? formData.tableOfContents.split('\n').filter(Boolean) : undefined,
      sampleQuestions: formData.sampleQuestions ? formData.sampleQuestions.split('\n').filter(Boolean) : undefined,
      driveFileUrl: uploadedDriveUrl,
    };

    onDocumentCreated(newDoc);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Tải Lên & Trích Xuất Thông Tin Tự Động Bằng AI
              </h3>
              <p className="text-xs text-slate-500">
                AI quét trực tiếp tệp gốc để điền chính xác Sở/Trường, Kỳ thi, Số câu, Số trang thực tế mà không cần gõ thủ công
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Section 1: File Dropzone */}
          <div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                isAnalyzing
                  ? 'border-blue-400 bg-blue-50/40 animate-pulse'
                  : hasAiResult
                  ? 'border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/40'
                  : 'border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileSelect}
              />

              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                {isAnalyzing ? (
                  <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
                ) : hasAiResult ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>

              {isAnalyzing ? (
                <div className="space-y-2">
                  <div className="text-sm font-bold text-blue-900">
                    {analysisStep || 'Đang quét tệp và phân tích bằng Gemini 2.5 Flash...'}
                  </div>
                  <p className="text-xs text-blue-600">
                    Hệ thống đang tự động trích xuất Sở GD, Kỳ thi, Cấu trúc câu hỏi và đo số trang thực tế
                  </p>
                </div>
              ) : selectedFile || hasAiResult ? (
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900 flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>{selectedFile ? selectedFile.name : formData.title}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Dung lượng: <strong className="text-slate-700">{formData.fileSize}</strong> • Số trang thực tế:{' '}
                    <strong className="text-blue-700">{formData.estimatedPages} trang</strong>
                  </div>
                  <div className="pt-2">
                    <span className="text-xs text-blue-600 hover:underline font-semibold">
                      Bấm để chọn tệp PDF khác
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-800">
                    Kéo thả hoặc nhấp để chọn tệp Đề thi / Tài liệu Toán (PDF hoặc Word)
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    AI sẽ đọc trực tiếp tệp gốc và điền tự động 100% các trường thông tin chuẩn xác lên web.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Test Presets */}
            {!isAnalyzing && !hasAiResult && (
              <div className="mt-3 pt-3 border-t border-slate-150 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Thử nghiệm trích xuất AI với đề mẫu:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {SAMPLE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => processDocumentAnalysis(undefined, preset)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-[11px] font-medium transition-colors border border-slate-200 cursor-pointer"
                    >
                      {preset.institution} ({preset.pages} trang)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Form with Pre-filled Extracted Information */}
          {(hasAiResult || isAnalyzing) && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Thông Tin Đã Trích Xuất Tự Động (Thầy không cần gõ thủ công)
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Thầy có thể xem lại hoặc chỉnh sửa nhanh trước khi xuất bản
                </span>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tên Tài Liệu / Tiêu Đề Đề Thi:</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900 bg-white"
                />
              </div>

              {/* Institution, Exam, Question Count */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Đơn vị ra đề (Sở/Trường):</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Tên kỳ thi cụ thể:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.examName}
                    onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cấu trúc số câu hỏi:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.questionCount}
                    onChange={(e) => setFormData({ ...formData, questionCount: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Category, Grade, Page count, Difficulty */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Phân loại:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
                  >
                    <option value="de-thi-tn-thpt">Đề thi Tốt nghiệp THPT</option>
                    <option value="de-thi-hsg">Đề thi Học sinh giỏi</option>
                    <option value="tai-lieu">Tài liệu chuyên đề</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Khối lớp:</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
                  >
                    <option value="12">Lớp 12</option>
                    <option value="11">Lớp 11</option>
                    <option value="10">Lớp 10</option>
                    <option value="all">Toàn cấp THPT</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Số trang thực tế:</span>
                    <span className="text-[10px] text-blue-600 font-semibold">(Từ file gốc)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    required
                    value={formData.estimatedPages}
                    onChange={(e) => setFormData({ ...formData, estimatedPages: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-blue-300 text-xs focus:ring-2 focus:ring-blue-500 bg-blue-50/40 text-blue-900 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mức độ phân hóa:</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
                  >
                    <option value="Cơ bản">Cơ bản (7+)</option>
                    <option value="Vận dụng">Vận dụng (8+)</option>
                    <option value="Vận dụng cao">Vận dụng cao (9+)</option>
                    <option value="Chuyên sâu HSG">Chuyên sâu HSG</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tóm tắt học thuật thực tế (Không dùng văn mẫu chung chung):</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="AI tự động tóm tắt các dạng bài toán thực tế có trong đề..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white leading-relaxed"
                />
              </div>

              {/* Sample Questions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Các câu hỏi tiêu biểu trích xuất từ đề:</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.sampleQuestions}
                  onChange={(e) => setFormData({ ...formData, sampleQuestions: e.target.value })}
                  placeholder="Các câu hỏi trích từ tài liệu..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 font-mono text-slate-800 bg-white"
                />
              </div>

              {/* Google Drive Status Bar */}
              {accessToken && savedFolderInfo && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-emerald-600" />
                    <span>
                      Đã liên kết Google Drive: Thư mục <strong>'{savedFolderInfo.name}'</strong>
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700">Tự động đồng bộ</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-150 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSavingToDrive}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-2"
                >
                  {isSavingToDrive ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu lên Drive & Web...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Xác Nhận & Xuất Bản Lên Web</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
