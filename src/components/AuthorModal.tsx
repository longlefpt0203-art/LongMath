import React from 'react';
import { X, QrCode, MessageSquare, Download, ShieldCheck, UserCheck, Heart, Award, Copy, Check } from 'lucide-react';
import { PersonalLogo } from './PersonalLogo';

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthorModal: React.FC<AuthorModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://zalo.me/longlefpt0203');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const a = window.document.createElement('a');
    a.href = '/author-zalo-qr.svg';
    a.download = 'QR-Zalo-TacGia-LeNgocLong.svg';
    a.click();
  };

  return (
    <div
      id="author-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="author-modal-card"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0">
              <PersonalLogo className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">Lê Ngọc Long</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Tác Giả & Bản Quyền
                </span>
              </div>
              <p className="text-xs text-blue-100/90">
                Toán Học THPT • Chia sẻ đề thi & Mã nguồn LaTeX
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-4">
          {/* Prominent Copyright Notice */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 text-left">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Thông báo bản quyền chính thức
            </div>
            <p className="text-sm font-extrabold text-slate-900">
              Website này thuộc Bản quyền của Lê Ngọc Long
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              Mọi tư liệu, chuyên đề, ngân hàng đề thi và quy trình tự động hóa AI được bảo vệ quyền tác giả.
            </p>
          </div>

          {/* QR Code Presentation Frame */}
          <div className="inline-block p-4 bg-white border-2 border-blue-100 rounded-3xl shadow-sm relative">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Mã QR Zalo Kết Nối Trực Tiếp
            </div>
            <img
              src="/author-zalo-qr.svg"
              alt="Mã QR Zalo Tác giả Lê Ngọc Long"
              className="w-56 h-56 mx-auto rounded-xl object-contain border border-slate-100 p-2 bg-white"
            />
            <div className="mt-2 text-xs font-semibold text-slate-700">
              Quét bằng Zalo hoặc Camera điện thoại
            </div>
          </div>

          {/* Value Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 text-left space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              Mục đích kết nối & trao đổi học thuật:
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Nhận trọn bộ mã nguồn <strong>LaTeX (.tex)</strong> và hình vẽ TikZ của tất cả đề thi.</li>
              <li>Giao lưu, đóng góp đề thi Học sinh giỏi và đề thi thử các trường THPT.</li>
              <li>Hỗ trợ giải đáp các bài toán phân hóa vận dụng cao (9+).</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleDownloadQr}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Lưu mã QR Zalo</span>
            </button>
            <a
              href="https://zalo.me/longlefpt0203"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-700/20"
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
