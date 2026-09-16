import React, { useState } from 'react';
import {
  X,
  Eye,
  Download,
  FileText,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  QrCode,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: DocumentItem) => void;
  onOpenQR: (doc: DocumentItem) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  isOpen,
  onClose,
  onDownload,
  onOpenQR,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!isOpen || !document) return null;

  // Prepare pages for preview
  const previewPages = document.previewPages && document.previewPages.length > 0
    ? document.previewPages
    : [
        `Trang 1 - Trích đoạn Lý thuyết & Khung ma trận:\nToàn bộ kiến thức trọng tâm của chuyên đề "${document.title}". Hệ thống hóa các định lý, công thức giải nhanh và sơ đồ tư duy phân loại bài toán theo chương trình chuẩn GDPT 2018.`,
        `Trang 2 - Trích đoạn Bài toán mẫu & Phương pháp giải:\n${document.sampleQuestions?.[0] || 'Minh họa phương pháp giải chuẩn mực, hướng dẫn phân tích bản chất hình học, mẹo biến đổi đại số và các bước tư duy tối ưu thời gian làm bài.'}\n\nLời giải chi tiết từng bước có nhận xét và đánh giá lỗi sai thường gặp của học sinh.`,
        `Trang 3 - Trích đoạn Bài tập thực hành & Bảng tra cứu:\n${document.sampleQuestions?.[1] || 'Hệ thống bài tập vận dụng và vận dụng cao rèn luyện kỹ năng giải nhanh. Bảng đáp án đối chiếu nhanh và mã QR tra cứu file nguồn LaTeX.'}`,
      ];

  const totalPages = Math.max(previewPages.length, 3);

  return (
    <div
      id="document-preview-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="document-preview-modal-container"
        className="bg-slate-900 text-white rounded-2xl md:rounded-3xl shadow-2xl border border-slate-700 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden relative"
      >
        {/* Top Control Bar */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-4 py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/20">
                  Xem trước tài liệu
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {document.latexExchangeCode}
                </span>
              </div>
              <h2 className="text-sm md:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
                {document.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Download button */}
            <button
              id="preview-direct-download-btn"
              onClick={() => onDownload(document)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải File PDF</span>
              <span>({document.fileSize})</span>
            </button>

            {/* LaTeX QR Code */}
            <button
              onClick={() => onOpenQR(document)}
              className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-600 cursor-pointer"
              title="Mã QR trao đổi file LaTeX"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Mã QR LaTeX</span>
            </button>

            {/* Close */}
            <button
              id="preview-close-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-700/60 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Viewer Toolbar: Page nav & Zoom */}
        <div className="bg-slate-800/50 border-b border-slate-700/60 px-4 py-2 flex items-center justify-between text-xs text-slate-300 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono">
              Trang {currentPageIndex + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPageIndex >= totalPages - 1}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-slate-400 hidden sm:inline ml-2">
              (Tổng cộng tài liệu gốc: {document.pages} trang)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
              className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs font-mono"
              title="Thu nhỏ"
            >
              -
            </button>
            <span className="font-mono text-xs text-slate-300 w-12 text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs font-mono"
              title="Phóng to"
            >
              +
            </button>
          </div>
        </div>

        {/* Document Render Area (PDF Viewport Simulation) */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-950 flex justify-center items-start">
          {document.fileDataUrl ? (
            /* Real PDF Viewer via object/iframe if uploaded by user */
            <div
              className="w-full h-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <iframe
                src={`${document.fileDataUrl}#page=${currentPageIndex + 1}&toolbar=0`}
                title={document.title}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            /* High-Fidelity Formatted Paper Sheet Viewport */
            <div
              className="w-full max-w-3xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 border border-slate-200 transition-transform duration-150 min-h-[600px] flex flex-col justify-between"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Paper Header */}
              <div>
                <div className="border-b-2 border-slate-800 pb-4 mb-6 flex items-start justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      CỔNG THÔNG TIN TOÁN THPT • TÁC GIẢ LÊ NGỌC LONG
                    </div>
                    <div className="text-xs font-semibold text-blue-700 mt-0.5">
                      Chương Trình Mới GDPT 2018 • Định Dạng Chuẩn Vector
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-slate-700">
                      {document.latexExchangeCode}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Trang {currentPageIndex + 1} / {totalPages}
                    </div>
                  </div>
                </div>

                {/* Paper Title on Page 1 */}
                {currentPageIndex === 0 && (
                  <div className="text-center mb-8">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 mb-2">
                      {document.category === 'tai-lieu'
                        ? 'TÀI LIỆU CHUYÊN ĐỀ'
                        : document.category === 'de-thi-hsg'
                        ? 'ĐỀ THI HỌC SINH GIỎI'
                        : 'ĐỀ THI TỐT NGHIỆP THPT'}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug max-w-2xl mx-auto">
                      {document.title}
                    </h1>
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                      Khối: Lớp {document.grade} • Chủ đề: {document.topic} • Mức độ: {document.difficulty}
                    </p>
                  </div>
                )}

                {/* Paper Page Content */}
                <div className="space-y-6 text-slate-800 leading-relaxed text-sm sm:text-base">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Trích đoạn nội dung trang {currentPageIndex + 1}
                    </h3>
                    <p className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">
                      {previewPages[currentPageIndex] || previewPages[0]}
                    </p>
                  </div>

                  {/* Sample questions or table of contents if available on respective pages */}
                  {currentPageIndex === 0 && document.tableOfContents && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        Mục lục nội dung chính:
                      </h4>
                      <div className="grid grid-cols-1 gap-1.5 pl-2">
                        {document.tableOfContents.map((item, idx) => (
                          <div key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentPageIndex > 0 && document.sampleQuestions && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        Câu hỏi & Bài toán thực tế trích từ đề:
                      </h4>
                      <div className="space-y-2">
                        {document.sampleQuestions.map((q, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs sm:text-sm font-mono text-slate-900"
                          >
                            {q}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Paper Footer */}
              <div className="border-t border-slate-200 pt-4 mt-8 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Bản quyền tài liệu: Thầy Lê Ngọc Long (FPT School)</span>
                </div>
                <div>
                  Trang {currentPageIndex + 1} của {totalPages} (Xem trước)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar: Action banner */}
        <div className="bg-slate-800/90 border-t border-slate-700 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Tài liệu đầy đủ gồm <strong>{document.pages} trang</strong> vector độ phân giải cao.</span>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors"
            >
              Đóng xem trước
            </button>
            <button
              onClick={() => onDownload(document)}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải Toàn Bộ File PDF ({document.fileSize})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
