import React, { useState } from 'react';
import { QrCode, X, Copy, Check, MessageSquare, ExternalLink, ShieldCheck, Download, UserCheck } from 'lucide-react';
import { DocumentItem } from '../types';

interface QRCodeModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ document, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!document) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(document.latexExchangeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const a = window.document.createElement('a');
    a.href = '/author-zalo-qr.svg';
    a.download = `QR-Zalo-LeNgocLong-${document.latexExchangeCode}.svg`;
    a.click();
  };

  return (
    <div
      id="qr-code-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="qr-code-modal-card"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg leading-tight">Mã QR Liên Hệ Tác Giả</h3>
              <p className="text-xs text-blue-100">Trao đổi file nguồn LaTeX & Chia sẻ đề thi</p>
            </div>
          </div>
          <button
            id="close-qr-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          {/* Author & Copyright Badge (Mandated by user) */}
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-left">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs md:text-sm">
                <UserCheck className="w-4 h-4 text-blue-700" />
                <span>Tác giả: Lê Ngọc Long</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
                Bản Quyền
              </span>
            </div>
            <p className="text-xs font-semibold text-blue-800">
              Website này thuộc Bản quyền của Lê Ngọc Long
            </p>
          </div>

          {/* Document Reference Info */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 mb-4 text-left">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Tài liệu yêu cầu trao đổi
            </div>
            <h4 className="text-xs md:text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
              {document.title}
            </h4>
            <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-500">Mã trao đổi LaTeX:</span>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {document.latexExchangeCode}
                </span>
                <button
                  id="copy-latex-code-btn"
                  onClick={handleCopyCode}
                  title="Sao chép mã"
                  className="p-1 rounded text-slate-500 hover:text-blue-700 hover:bg-slate-200/60 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* QR Code Canvas Frame */}
          <div className="inline-block p-3.5 bg-white border-2 border-slate-200 rounded-2xl shadow-sm mb-4 relative">
            <img
              src="/author-zalo-qr.svg"
              alt="Mã QR Zalo Tác giả Lê Ngọc Long"
              className="w-52 h-52 mx-auto rounded-lg object-contain"
            />
            <div className="mt-2 text-[11px] font-medium text-slate-600">
              Quét bằng Camera điện thoại hoặc ứng dụng Zalo
            </div>
          </div>

          {/* Value proposition note */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 text-left mb-5 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Quét mã Zalo để nhắn tin trực tiếp với <strong>Thầy Lê Ngọc Long</strong> nhận trọn bộ file nguồn <strong>.tex</strong>, TikZ và đáp án chi tiết.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="download-qr-btn"
              onClick={handleDownloadQr}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải ảnh QR Zalo</span>
            </button>
            <a
              id="open-zalo-btn"
              href="https://zalo.me/longlefpt0203"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-sm shadow-blue-700/20"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mở Zalo Tác Giả</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
