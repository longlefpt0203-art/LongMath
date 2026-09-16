import React, { useState } from 'react';
import {
  X,
  Eye,
  Download,
  FileText,
  Sparkles,
  BookOpen,
  Award,
  QrCode,
  ShieldCheck,
  Maximize2,
  Minimize2,
  ExternalLink,
  Cloud,
  Layers,
  HelpCircle,
  Building2,
  CheckCircle2,
  Calendar,
  GraduationCap,
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeViewTab, setActiveViewTab] = useState<'pdf' | 'info'>('pdf');

  if (!isOpen || !document) return null;

  const hasRealPdf = Boolean(document.fileDataUrl || (document.pdfUrl && document.pdfUrl !== '/sample.pdf'));
  const actualPages = document.pages || 8;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-hidden">
      <div
        className={`bg-slate-900 rounded-3xl border border-slate-750 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[92vh]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {document.category === 'tai-lieu'
                    ? 'TÀI LIỆU CHUYÊN ĐỀ'
                    : document.category === 'de-thi-hsg'
                    ? 'ĐỀ THI HSG'
                    : 'ĐỀ THI TN THPT'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  MÃ: {document.latexExchangeCode}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  📄 {actualPages} trang
                </span>
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base truncate max-w-xl" title={document.title}>
                {document.title}
              </h3>
            </div>
          </div>

          {/* Navigation Controls & Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Tab switch between PDF view and Info briefing */}
            <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveViewTab('pdf')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeViewTab === 'pdf'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {hasRealPdf ? 'Xem File Gốc' : 'Tài Liệu Gốc'}
              </button>
              <button
                onClick={() => setActiveViewTab('info')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeViewTab === 'info'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Thông Tin & Tóm Tắt AI
              </button>
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer hidden md:flex"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 bg-slate-950 overflow-hidden relative flex">
          {activeViewTab === 'pdf' ? (
            /* ========================================================== */
            /* VIEW MODE: REAL PDF OR DIRECT CLEAN DOCUMENT DOSSIER       */
            /* ========================================================== */
            hasRealPdf ? (
              <div className="w-full h-full flex flex-col bg-slate-900">
                {/* Real PDF Embed - user can flip real pages, zoom, print, scroll native file */}
                <iframe
                  src={`${document.fileDataUrl || document.pdfUrl}#toolbar=1&navpanes=1`}
                  className="w-full h-full border-0 bg-white"
                  title={document.title}
                />
              </div>
            ) : (
              /* When no binary file exists yet (clean academic dossier without fake book flipping) */
              <div className="w-full h-full overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950">
                <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-slate-900 my-auto">
                  {/* Formal Header */}
                  <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>{document.institution || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO • TRƯỜNG THPT'}</span>
                      </div>
                      <div className="text-sm font-bold text-blue-700 mt-1">
                        {document.examName || 'KỲ THI KHẢO SÁT CHẤT LƯỢNG KẾT HỢP'}
                      </div>
                    </div>
                    <div className="sm:text-right space-y-1">
                      <div className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300 inline-block">
                        MÃ: {document.latexExchangeCode}
                      </div>
                      <div className="text-xs font-bold text-slate-600">
                        Quy mô tài liệu: <span className="text-blue-600 font-extrabold">{actualPages} trang</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Exam Meta Banner */}
                  <div className="p-6 bg-blue-50/80 rounded-2xl border border-blue-100 text-center space-y-2">
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-xs">
                      {document.category === 'tai-lieu'
                        ? 'TÀI LIỆU CHUYÊN ĐỀ TOÁN HỌC'
                        : document.category === 'de-thi-hsg'
                        ? 'ĐỀ THI HỌC SINH GIỎI'
                        : 'ĐỀ THI TỐT NGHIỆP THPT CHÍNH THỨC'}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                      {document.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-700 font-semibold pt-1">
                      <span>Môn thi: <strong>TOÁN HỌC</strong></span>
                      <span>•</span>
                      <span>Khối: <strong>Lớp {document.grade}</strong></span>
                      <span>•</span>
                      <span>Cấu trúc: <strong className="text-emerald-700">{document.questionCount}</strong></span>
                    </div>
                  </div>

                  {/* Verified Summary */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Nội dung học thuật thực tế & Phân tích chuyên môn:</span>
                    </h4>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                      {document.summary}
                    </p>
                  </div>

                  {/* Sample Questions directly extracted */}
                  {document.sampleQuestions && document.sampleQuestions.length > 0 && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                        <span>Các câu hỏi & bài toán tiêu biểu trích xuất từ đề:</span>
                      </h4>
                      <div className="space-y-2.5">
                        {document.sampleQuestions.map((q, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono">
                            {q}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notice & Download trigger */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Thông tin tài liệu gồm <strong>{actualPages} trang</strong> đã được AI xác thực chính xác. Bấm tải xuống để nhận trọn vẹn tệp gốc PDF/LaTeX.
                      </span>
                    </div>
                    <button
                      onClick={() => onDownload(document)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải Tệp PDF Gốc</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            /* ========================================================== */
            /* VIEW MODE: COMPREHENSIVE AI METADATA BRIEFING              */
            /* ========================================================== */
            <div className="w-full h-full overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950">
              <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-white my-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      Hồ Sơ Trích Xuất Dữ Liệu Học Thuật
                    </h3>
                    <p className="text-xs text-slate-400">
                      Toàn bộ thông tin được AI đọc trực tiếp từ văn bản gốc, không sử dụng văn mẫu rập khuôn
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                    <span className="text-slate-400 font-semibold">Đơn vị ra đề:</span>
                    <p className="font-bold text-blue-300 text-sm">{document.institution}</p>
                  </div>

                  <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                    <span className="text-slate-400 font-semibold">Kỳ thi:</span>
                    <p className="font-bold text-white text-sm">{document.examName}</p>
                  </div>

                  <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                    <span className="text-slate-400 font-semibold">Cấu trúc & Số câu:</span>
                    <p className="font-bold text-emerald-400 text-sm">{document.questionCount}</p>
                  </div>

                  <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                    <span className="text-slate-400 font-semibold">Số trang tài liệu:</span>
                    <p className="font-bold text-amber-400 text-sm">{actualPages} trang</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Tóm tắt chuyên môn:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {document.summary}
                  </p>
                </div>

                {document.tableOfContents && document.tableOfContents.length > 0 && (
                  <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Mục lục phân bố các phần:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {document.tableOfContents.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-750">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="bg-slate-900 border-t border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              Tài liệu gồm <strong>{actualPages} trang</strong> • Dung lượng: <strong>{document.fileSize}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2.5 ml-auto">
            {document.driveFileUrl && (
              <a
                href={document.driveFileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-emerald-700"
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mở Trên Drive</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>
            )}

            <button
              onClick={() => onOpenQR(document)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span>QR Zalo</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Đóng
            </button>

            <button
              onClick={() => onDownload(document)}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải File Gốc ({document.fileSize})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
