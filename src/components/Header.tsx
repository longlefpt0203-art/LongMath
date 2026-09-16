import React from 'react';
import {
  BookOpen,
  Award,
  UploadCloud,
  FileCode2,
  Sparkles,
  QrCode,
  GraduationCap,
  Layers,
  Search,
} from 'lucide-react';
import { MainNavTab } from '../types';
import { PersonalLogo } from './PersonalLogo';

interface HeaderProps {
  activeTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  onOpenAdminUpload: () => void;
  onOpenDesignSpec: () => void;
  onOpenAuthorQR: () => void;
  documentCount: number;
  examCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAdminUpload,
  onOpenDesignSpec,
  onOpenAuthorQR,
  documentCount,
  examCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Accent Line */}
      <div className="h-1 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Brand / Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <div
              id="site-personal-logo"
              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-slate-200/90 shadow-xs p-1 flex items-center justify-center hover:shadow-md transition-all shrink-0 cursor-pointer"
              onClick={onOpenAuthorQR}
              title="Logo cá nhân Lê Ngọc Long - Bấm để xem thông tin tác giả"
            >
              <PersonalLogo className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900">
                  TOÁN THPT
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Thư viện tài liệu & đề thi chuẩn cấu trúc • Tác giả: <strong>Lê Ngọc Long</strong>
              </p>
            </div>
          </div>

          {/* 2 Primary Navigation Tabs (Mandated in Prompt) */}
          <nav className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
            {/* Tab 1: Tài liệu */}
            <button
              id="nav-tab-tai-lieu"
              onClick={() => onTabChange('tai-lieu')}
              className={`flex items-center space-x-2 px-3.5 md:px-5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
                activeTab === 'tai-lieu'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Tài liệu</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                  activeTab === 'tai-lieu' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {documentCount}
              </span>
            </button>

            {/* Tab 2: Đề thi (Chứa HSG & TN THPT) */}
            <button
              id="nav-tab-de-thi"
              onClick={() => onTabChange('de-thi')}
              className={`flex items-center space-x-2 px-3.5 md:px-5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
                activeTab === 'de-thi'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Đề thi</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                  activeTab === 'de-thi' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {examCount}
              </span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2">
            {/* Author Zalo QR & Copyright trigger */}
            <button
              id="open-author-qr-btn"
              onClick={onOpenAuthorQR}
              className="px-3 py-2 rounded-xl text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200/90 transition-all flex items-center gap-1.5 shadow-xs"
              title="Mã QR liên hệ tác giả Lê Ngọc Long (Bản quyền)"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-700" />
              <span className="hidden sm:inline">Tác giả:</span>
              <span className="font-extrabold text-blue-700">Lê Ngọc Long</span>
            </button>

            {/* Design Spec Button (Requirement Presentation) */}
            <button
              id="open-design-spec-btn"
              onClick={onOpenDesignSpec}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors hidden md:flex items-center gap-1.5"
              title="Xem bản vẽ & đặc tả thiết kế chi tiết 5 phần"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Bản Thiết Kế UI/UX</span>
            </button>

            {/* Admin Upload Button (Mandated Backend Requirement) */}
            <button
              id="open-admin-upload-btn"
              onClick={onOpenAdminUpload}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 transition-all flex items-center gap-1.5 shadow-sm shadow-blue-700/20"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload PDF (Admin)</span>
              <span className="hidden lg:inline-flex items-center text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full">
                AI Auto
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
