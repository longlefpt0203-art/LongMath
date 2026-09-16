import React from 'react';
import { Download, QrCode, FileText, Sparkles, BookOpen, Award, ArrowUpRight, CheckCircle2, Eye, Trash2 } from 'lucide-react';
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
          className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug cursor-pointer mb-2.5"
          title={document.title}
        >
          {document.title}
        </h3>

        {/* 2-4 Sentence Summary (Mandated in specs) */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
          {document.summary}
        </p>

        {/* Topic & Tags */}
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

      {/* Bottom Meta & Primary Action Section */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col gap-3">
        {/* Meta Stats */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center space-x-3">
            <span>{document.pages} trang</span>
            <span>•</span>
            <span>{document.fileSize}</span>
          </div>
          <div className="text-slate-500">
            {document.downloads.toLocaleString('vi-VN')} lượt tải
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {/* Nút Xem trước */}
          <button
            id={`btn-preview-${document.id}`}
            onClick={() => onPreview(document)}
            className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 border border-slate-200 transition-colors cursor-pointer"
            title="Xem trước nội dung tài liệu trước khi tải"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Xem trước</span>
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

          {/* Mã QR quét liên hệ Admin (để trao đổi file LaTeX nếu cần) */}
          <button
            id={`btn-qr-${document.id}`}
            onClick={() => onOpenQR(document)}
            className="py-2.5 px-2 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer"
            title="Quét mã QR trao đổi file nguồn LaTeX"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Mã LaTeX</span>
          </button>
        </div>
      </div>
    </div>
  );
};
