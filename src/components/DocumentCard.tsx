import React, { useState } from 'react';
import {
  Download,
  QrCode,
  FileText,
  Sparkles,
  BookOpen,
  Award,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  Trash2,
  Building2,
  HelpCircle,
  Cloud,
  Maximize2,
} from 'lucide-react';
import { DocumentItem, UserRole } from '../types';

interface DocumentCardProps {
  document: DocumentItem;
  onOpenQR: (doc: DocumentItem) => void;
  onOpenDetail: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onPreview: (doc: DocumentItem) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
  userRole?: UserRole;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onOpenQR,
  onOpenDetail,
  onDownload,
  onPreview,
  onDelete,
  userRole = 'guest',
}) => {
  // Default to showing Page 1 directly as requested by the user
  const [cardTab, setCardTab] = useState<'page1' | 'summary'>('page1');

  // Category visual badge styling
  const getCategoryBadge = () => {
    switch (document.category) {
      case 'tai-lieu':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <BookOpen className="w-3 h-3" />
            Tài liệu chuyên đề
          </span>
        );
      case 'de-thi-hsg':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Award className="w-3 h-3" />
            Đề thi HSG
          </span>
        );
      case 'de-thi-tn-thpt':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3 h-3" />
            Đề thi TN THPT
          </span>
        );
    }
  };

  return (
    <div
      id={`doc-card-${document.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col justify-between overflow-hidden relative"
    >
      {/* Top Section */}
      <div className="p-5 pb-4">
        {/* Badges Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {getCategoryBadge()}
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
              {document.grade === 'all' ? 'Toàn cấp THPT' : `Lớp ${document.grade}`}
            </span>
            {document.hasLatex && (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                LaTeX
              </span>
            )}
            {document.driveFileUrl && (
              <a
                href={document.driveFileUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                title="Đã lưu trữ trên Google Drive Thầy Long"
              >
                <Cloud className="w-3 h-3" />
                <span>Drive</span>
              </a>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400">
              {document.latexExchangeCode}
            </span>
            {userRole === 'admin' && onDelete && (
              <button
                id={`btn-delete-${document.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Xóa tài liệu "${document.title}"?`)) {
                    onDelete(document.id, e);
                  }
                }}
                className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Xóa tài liệu này (Admin)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenDetail(document)}
          className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug cursor-pointer mb-2"
          title={document.title}
        >
          {document.title}
        </h3>

        {/* Institution & Question Count Metadata */}
        {(document.institution || document.questionCount) && (
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5 text-[11px]">
            {document.institution && (
              <span className="inline-flex items-center gap-1 font-semibold text-blue-900 bg-blue-50/90 px-2 py-0.5 rounded border border-blue-100">
                <Building2 className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="truncate max-w-[170px]">{document.institution}</span>
              </span>
            )}
            {document.questionCount && (
              <span className="inline-flex items-center gap-1 font-medium text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">
                <HelpCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate max-w-[170px]">{document.questionCount}</span>
              </span>
            )}
          </div>
        )}

        {/* Card View Mode Selector: View Trang 1 vs Tóm tắt */}
        <div className="flex items-center gap-1 my-2.5 pb-2 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setCardTab('page1')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              cardTab === 'page1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Xem Trang Đầu (Trang 1)</span>
          </button>
          <button
            type="button"
            onClick={() => setCardTab('summary')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              cardTab === 'summary'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Tóm Tắt & Mô Tả</span>
          </button>
        </div>

        {/* Dynamic Display Area: Direct View Trang 1 vs Summary */}
        {cardTab === 'page1' ? (
          /* DIRECT VIEW TRANG ĐẦU TIÊN CỦA TÀI LIỆU */
          document.fileDataUrl ? (
            /* Uploaded PDF: Iframe rendering page 1 with hover action */
            <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-2xs group/cover my-2">
              <iframe
                src={`${document.fileDataUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
                title={`Trang 1: ${document.title}`}
                className="w-full h-full border-0 pointer-events-none"
              />
              <div
                onClick={() => onPreview(document)}
                className="absolute inset-0 bg-slate-900/0 group-hover/cover:bg-slate-900/40 transition-all flex items-center justify-center cursor-pointer"
                title="Bấm để phóng to xem tất cả các trang"
              >
                <span className="opacity-0 group-hover/cover:opacity-100 transition-all px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-1 group-hover/cover:translate-y-0">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Xem tất cả {document.pages} trang</span>
                </span>
              </div>
              <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                Trang 1 / {document.pages}
              </div>
            </div>
          ) : (
            /* Authentic Miniature A4 Exam Sheet for Page 1 */
            <div
              onClick={() => onPreview(document)}
              className="relative w-full bg-slate-50 hover:bg-slate-100/90 rounded-xl p-3.5 border border-slate-300 shadow-2xs text-[11px] text-slate-800 cursor-pointer transition-all group/sheet my-2 space-y-2"
              title="Bấm để xem đầy đủ tất cả các trang của tài liệu này"
            >
              {/* Exam Header */}
              <div className="border-b border-slate-400 pb-1.5 flex items-start justify-between">
                <div>
                  <div className="font-extrabold uppercase text-[10px] text-slate-700 truncate max-w-[170px]">
                    {document.institution || 'SỞ GD&ĐT • TRƯỜNG THPT'}
                  </div>
                  <div className="text-[10px] text-blue-700 font-bold truncate max-w-[170px]">
                    {document.examName || 'ĐỀ THI KHẢO SÁT CHẤT LƯỢNG'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">
                    {document.latexExchangeCode}
                  </div>
                  <div className="text-[9px] text-slate-500">Mã đề: 101</div>
                </div>
              </div>

              {/* Exam Title & Subject */}
              <div className="text-center py-1 bg-white rounded-lg border border-slate-200 px-2">
                <div className="font-black text-xs text-slate-900 line-clamp-1">
                  {document.title}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Môn: <strong>Toán</strong> • Khối {document.grade} • 90 phút • {document.questionCount || '50 câu'}
                </div>
              </div>

              {/* Excerpt of Page 1 Questions */}
              <div className="p-2 bg-white rounded-lg border border-slate-200 space-y-1 font-sans">
                <div className="font-bold text-[10px] text-blue-900 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-blue-600" />
                  <span>Trang 1: Trích đoạn câu hỏi mở đầu</span>
                </div>
                <p className="text-[10px] text-slate-700 line-clamp-2 italic">
                  {document.sampleQuestions?.[0] || 'Câu 1: Cho hàm số y = f(x) liên tục trên R và có đạo hàm f\'(x). Tìm số điểm cực trị và khoảng đồng biến...'}
                </p>
              </div>

              {/* Footer of Mini Sheet */}
              <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Trang 1 / {document.pages} trang
                </span>
                <span className="text-blue-600 font-bold group-hover/sheet:underline flex items-center gap-0.5">
                  <span>Xem tất cả trang</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          )
        ) : (
          /* Summary Mode */
          <div className="space-y-3 my-2">
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
              {document.summary}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-medium text-blue-800 bg-blue-50/80 px-2 py-0.5 rounded">
                #{document.topic}
              </span>
              {document.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-150"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Meta & Primary Action Section */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col gap-3">
        {/* Meta Stats */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-blue-900">{document.pages} trang đầy đủ</span>
            <span>•</span>
            <span>{document.fileSize}</span>
          </div>
          <div className="text-slate-500">
            {document.downloads.toLocaleString('vi-VN')} lượt tải
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {/* Nút Xem trước (mở tất cả các trang) */}
          <button
            id={`btn-preview-${document.id}`}
            onClick={() => onPreview(document)}
            className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 border border-slate-200 transition-colors cursor-pointer"
            title={`Xem toàn bộ ${document.pages} trang tài liệu`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Xem tất cả</span>
          </button>

          {/* Nút Tải tài liệu */}
          <button
            id={`btn-download-${document.id}`}
            onClick={() => onDownload(document)}
            className="py-2.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-all hover:shadow-md hover:shadow-blue-600/20 cursor-pointer"
            title="Tải ngay file PDF"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Tải về</span>
          </button>

          {/* Mã QR quét liên hệ Admin */}
          <button
            id={`btn-qr-${document.id}`}
            onClick={() => onOpenQR(document)}
            className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 border border-slate-200 transition-colors cursor-pointer"
            title="Mã QR Zalo trao đổi file nguồn LaTeX"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Mã QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
