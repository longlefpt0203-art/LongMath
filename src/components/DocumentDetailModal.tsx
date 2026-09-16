import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Download,
  QrCode,
  FileText,
  BookOpen,
  Award,
  Sparkles,
  Calendar,
  Layers,
  HardDrive,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Share2,
  MessageCircle,
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentDetailModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onDownload: (doc: DocumentItem) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  onClose,
  onDownload,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!document) return;

    const contactText = `https://zalo.me/0987654321?text=Kính gửi Thầy/Cô Admin, tôi quan tâm và muốn xin/trao đổi file nguồn LaTeX của tài liệu: [${document.latexExchangeCode}] - ${document.title}`;

    QRCode.toDataURL(contactText, {
      width: 180,
      margin: 1,
      color: {
        dark: '#1E3A8A',
        light: '#FFFFFF',
      },
    })
      .then(setQrUrl)
      .catch(console.error);
  }, [document]);

  if (!document) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(document.latexExchangeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryTitle = () => {
    switch (document.category) {
      case 'tai-lieu':
        return 'Tài liệu & Chuyên đề Toán THPT';
      case 'de-thi-hsg':
        return 'Đề thi Học sinh giỏi (HSG)';
      case 'de-thi-tn-thpt':
        return 'Đề thi Tốt nghiệp THPT';
    }
  };

  return (
    <div
      id="document-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="document-detail-modal-container"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative animate-scale-up"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
            <span>Toán THPT</span>
            <span>/</span>
            <span className="text-blue-700 font-semibold">{getCategoryTitle()}</span>
            <span>/</span>
            <span className="font-mono text-slate-600 font-bold">{document.latexExchangeCode}</span>
          </div>
          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Main Title & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {document.category === 'tai-lieu'
                  ? 'Chuyên đề lý thuyết'
                  : document.category === 'de-thi-hsg'
                  ? 'Đề thi chọn HSG'
                  : 'Đề thi Tốt nghiệp THPT'}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                Khối: Lớp {document.grade}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                {document.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-500 bg-slate-50">
                {document.author}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">
              {document.title}
            </h1>
          </div>

          {/* 2-4 Sentence Summary (Core Requirement) */}
          <div className="p-4 md:p-5 rounded-xl bg-blue-50/50 border border-blue-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Tóm tắt nội dung chính (Trích xuất bởi AI)
            </h4>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed font-normal">
              {document.summary}
            </p>
          </div>

          {/* Two Columns: Detail Content & Interactive QR Code Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Syllabus / Structure / Preview */}
            <div className="lg:col-span-2 space-y-5">
              {/* Document Overview Meta */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Dung lượng PDF</div>
                  <div className="font-bold text-slate-800 text-sm">{document.fileSize}</div>
                </div>
                <div className="border-x border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">Số trang</div>
                  <div className="font-bold text-slate-800 text-sm">{document.pages} trang</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Lượt tải</div>
                  <div className="font-bold text-blue-700 text-sm">{document.downloads} lượt</div>
                </div>
              </div>

              {/* Table of contents / Structure */}
              {document.tableOfContents && (
                <div className="border border-slate-200 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Cấu trúc & Mục lục tài liệu
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {document.tableOfContents.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample excerpt */}
              {document.sampleQuestions && (
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Trích đoạn câu hỏi tiêu biểu
                  </h4>
                  <div className="space-y-2 text-xs md:text-sm font-mono text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
                    {document.sampleQuestions.map((q, idx) => (
                      <p key={idx} className="py-1 border-b border-slate-100 last:border-0">
                        {q}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags list */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-xs text-slate-400 font-medium">Chủ đề & Thẻ:</span>
                {document.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Col: Primary Actions & Admin QR Exchange Box */}
            <div className="space-y-5">
              {/* Primary Download Box */}
              <div className="p-5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-white/15 flex items-center justify-center mb-3">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-base mb-1">Tải Tài Liệu Miễn Phí</h4>
                <p className="text-xs text-blue-100 mb-4">
                  Định dạng PDF vector rõ nét, in ấn đẹp, hỗ trợ học tập trực tiếp.
                </p>
                <button
                  id="detail-download-pdf-btn"
                  onClick={() => onDownload(document)}
                  className="w-full py-3 px-4 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File PDF ({document.fileSize})</span>
                </button>
              </div>

              {/* QR Code Exchange for LaTeX with Author Lê Ngọc Long */}
              <div className="p-5 rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50/60 to-white text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  Trao Đổi File Nguồn LaTeX
                </div>
                <div className="text-[11px] font-bold text-blue-800 mb-2">
                  Tác giả: Lê Ngọc Long
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Quét mã Zalo để liên hệ trực tiếp với <strong>Thầy Lê Ngọc Long</strong> trao đổi file nguồn <strong>.tex</strong>.
                </p>

                {/* QR Display with authentic author Zalo QR */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 inline-block shadow-sm mb-3">
                  <img
                    src="/author-zalo-qr.svg"
                    alt="Mã QR Zalo Tác giả Lê Ngọc Long"
                    className="w-36 h-36 mx-auto rounded-md object-contain"
                  />
                </div>

                <div className="bg-slate-100 rounded-lg p-2 text-xs flex items-center justify-between font-mono font-bold text-slate-800 mb-2">
                  <span>Mã: {document.latexExchangeCode}</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
                    title="Copy mã"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <a
                  href="https://zalo.me/longlefpt0203"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mb-2.5 shadow-sm shadow-blue-700/20"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat Zalo Tác Giả</span>
                </a>

                {/* Mandated Copyright Note */}
                <p className="text-[11px] font-medium text-slate-500 border-t border-slate-200/80 pt-2">
                  Website này thuộc Bản quyền của <strong>Lê Ngọc Long</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
