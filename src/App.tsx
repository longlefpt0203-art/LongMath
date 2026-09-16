import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { DocumentCard } from './components/DocumentCard';
import { QRCodeModal } from './components/QRCodeModal';
import { DocumentDetailModal } from './components/DocumentDetailModal';
import { AdminUploadModal } from './components/AdminUploadModal';
import { DesignSpecModal } from './components/DesignSpecModal';
import { AuthorModal } from './components/AuthorModal';
import { PersonalLogo } from './components/PersonalLogo';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { initAuth, logout } from './services/firebaseAuth';
import { DriveFolderInfo } from './services/googleDriveService';
import { User } from 'firebase/auth';
import { DocumentItem, MainNavTab, UserRole } from './types';
import { INITIAL_DOCUMENTS } from './data/initialDocuments';
import { downloadDocumentFile } from './utils/pdfGenerator';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import {
  BookOpen,
  Award,
  Sparkles,
  Download,
  QrCode,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  FileText,
  Search,
  Layers,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  Cloud,
  Plus,
  UploadCloud,
  FolderOpen,
  User as UserIcon,
  Eye,
  Trash2,
} from 'lucide-react';

export default function App() {
  // Role State: guest vs admin (Clear distinction requested by user)
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('toan_portal_user_role');
      return (saved as UserRole) || 'admin';
    } catch {
      return 'admin';
    }
  });

  const toggleUserRole = () => {
    setUserRole((prev) => {
      const next: UserRole = prev === 'admin' ? 'guest' : 'admin';
      try {
        localStorage.setItem('toan_portal_user_role', next);
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Master document list (Initialized completely empty after purging all old data)
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      // Purge all legacy and cached test data as requested: "xoá hết data cũ đi"
      localStorage.removeItem('toan_portal_user_docs');
      localStorage.removeItem('toan_portal_user_docs_v2');
      localStorage.removeItem('toan_portal_documents_v2');
      localStorage.removeItem('toan_portal_user_docs_v3');
      localStorage.removeItem('toan_portal_user_docs_v4');

      const saved = localStorage.getItem('toan_portal_user_docs_v5');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Persist real documents added by user to clean localStorage key
  useEffect(() => {
    try {
      localStorage.setItem('toan_portal_user_docs_v5', JSON.stringify(documents));
    } catch (e) {
      console.error(e);
    }
  }, [documents]);

  // Navigation & Filtering State
  const [activeNavTab, setActiveNavTab] = useState<MainNavTab>('tai-lieu');
  const [examSubTag, setExamSubTag] = useState<'all' | 'de-thi-hsg' | 'de-thi-tn-thpt'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả chuyên đề');
  const [sortBy, setSortBy] = useState<'newest' | 'downloads' | 'pages'>('newest');

  // Modal States
  const [qrDoc, setQrDoc] = useState<DocumentItem | null>(null);
  const [detailDoc, setDetailDoc] = useState<DocumentItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [isAdminUploadOpen, setIsAdminUploadOpen] = useState<boolean>(false);
  const [isDesignSpecOpen, setIsDesignSpecOpen] = useState<boolean>(false);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState<boolean>(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);

  // Google Drive & Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [savedFolderInfo, setSavedFolderInfo] = useState<DriveFolderInfo | null>(() => {
    try {
      const saved = localStorage.getItem('drive_auto_folder');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Tự động lắng nghe trạng thái đăng nhập Firebase Auth
  React.useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleFolderUpdated = (folder: DriveFolderInfo) => {
    setSavedFolderInfo(folder);
    try {
      localStorage.setItem('drive_auto_folder', JSON.stringify(folder));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setAccessToken(null);
  };

  // Toast feedback state
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  // Counts
  const docCount = useMemo(() => documents.filter((d) => d.category === 'tai-lieu').length, [documents]);
  const examCount = useMemo(() => documents.filter((d) => d.category !== 'tai-lieu').length, [documents]);
  const hsgCount = useMemo(() => documents.filter((d) => d.category === 'de-thi-hsg').length, [documents]);
  const tnCount = useMemo(() => documents.filter((d) => d.category === 'de-thi-tn-thpt').length, [documents]);

  // Filtered & Sorted items
  const filteredDocuments = useMemo(() => {
    return documents
      .filter((item) => {
        // 1. Check Primary Tab
        if (activeNavTab === 'tai-lieu') {
          if (item.category !== 'tai-lieu') return false;
        } else {
          // In "de-thi" tab
          if (item.category === 'tai-lieu') return false;

          // Check sub-tag
          if (examSubTag === 'de-thi-hsg' && item.category !== 'de-thi-hsg') return false;
          if (examSubTag === 'de-thi-tn-thpt' && item.category !== 'de-thi-tn-thpt') return false;
        }

        // 2. Grade filter
        if (selectedGrade !== 'all') {
          if (item.grade !== selectedGrade && item.grade !== 'all') return false;
        }

        // 3. Topic filter
        if (selectedTopic !== 'Tất cả chuyên đề') {
          if (item.topic !== selectedTopic) return false;
        }

        // 4. Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchSummary = item.summary.toLowerCase().includes(q);
          const matchCode = item.latexExchangeCode.toLowerCase().includes(q);
          const matchTopic = item.topic.toLowerCase().includes(q);
          const matchInstitution = item.institution?.toLowerCase().includes(q) || false;
          const matchExamName = item.examName?.toLowerCase().includes(q) || false;
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchSummary && !matchCode && !matchTopic && !matchInstitution && !matchExamName && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        }
        if (sortBy === 'downloads') {
          return b.downloads - a.downloads;
        }
        if (sortBy === 'pages') {
          return b.pages - a.pages;
        }
        return 0;
      });
  }, [documents, activeNavTab, examSubTag, selectedGrade, selectedTopic, searchQuery, sortBy]);

  // Handlers
  const handleDownload = (doc: DocumentItem) => {
    // Increment download count locally
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, downloads: d.downloads + 1 } : d))
    );

    // Provide friendly download toast notification
    setDownloadNotification(`Đang tải xuống file PDF: "${doc.title.slice(0, 50)}..."`);
    setTimeout(() => {
      setDownloadNotification(null);
    }, 4000);

    // Trigger real download with proper PDF Blob and filename
    try {
      downloadDocumentFile(doc);
    } catch (e) {
      console.error('Error downloading document file:', e);
    }
  };

  const handleDocumentCreated = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);

    // Automatically switch to the tab that contains the newly created document
    if (newDoc.category === 'tai-lieu') {
      setActiveNavTab('tai-lieu');
    } else {
      setActiveNavTab('de-thi');
      setExamSubTag(newDoc.category as any);
    }

    setDownloadNotification(`AI đã tải lên & xuất bản thành công: "${newDoc.title.slice(0, 50)}..."`);
    setTimeout(() => {
      setDownloadNotification(null);
    }, 5000);
  };

  const handleDeleteDocument = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDocuments((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem('toan_portal_user_docs_v2', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
    setDownloadNotification('Đã xóa tài liệu khỏi hệ thống.');
    setTimeout(() => {
      setDownloadNotification(null);
    }, 3000);
  };

  const handleClearAllDocuments = () => {
    if (window.confirm('Thầy Long có chắc chắn muốn xóa toàn bộ dữ liệu tài liệu trên website để làm mới không?')) {
      setDocuments([]);
      try {
        localStorage.removeItem('toan_portal_user_docs');
        localStorage.removeItem('toan_portal_user_docs_v2');
        localStorage.removeItem('toan_portal_documents_v2');
        localStorage.removeItem('toan_portal_user_docs_v3');
        localStorage.removeItem('toan_portal_user_docs_v4');
        localStorage.removeItem('toan_portal_user_docs_v5');
      } catch (err) {
        console.error(err);
      }
      setDownloadNotification('Đã xóa sạch toàn bộ dữ liệu tài liệu cũ trên hệ thống.');
      setTimeout(() => {
        setDownloadNotification(null);
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeNavTab}
        onTabChange={setActiveNavTab}
        onOpenAdminUpload={() => setIsAdminUploadOpen(true)}
        onOpenDesignSpec={() => setIsDesignSpecOpen(true)}
        onOpenAuthorQR={() => setIsAuthorModalOpen(true)}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        driveFolderReady={!!savedFolderInfo}
        documentCount={docCount}
        examCount={examCount}
        userRole={userRole}
        onToggleUserRole={toggleUserRole}
      />

      {/* Floating Download Toast */}
      {downloadNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-fade-in text-xs md:text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{downloadNotification}</span>
        </div>
      )}

      {/* Hero / Context Sub-Header */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  {activeNavTab === 'tai-lieu' ? 'Phân hệ 1: Tài liệu' : 'Phân hệ 2: Đề thi'}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">
                  Toán Học THPT (Lớp 10, 11, 12)
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                {activeNavTab === 'tai-lieu'
                  ? 'Kho Tài Liệu & Chuyên Đề Toán THPT'
                  : examSubTag === 'de-thi-hsg'
                  ? 'Tuyển Tập Đề Thi Học Sinh Giỏi (HSG) Cấp Tỉnh & Quốc Gia'
                  : examSubTag === 'de-thi-tn-thpt'
                  ? 'Tuyển Tập Đề Thi Thử Tốt Nghiệp THPT (Format Mới GDPT 2018)'
                  : 'Ngân Hàng Đề Thi Toán THPT: HSG & Tốt Nghiệp THPT'}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
                {activeNavTab === 'tai-lieu'
                  ? 'Hệ thống chuyên đề lý thuyết trọng tâm, bài tập phân dạng có lời giải chi tiết và hướng dẫn bấm máy tính Casio dành cho học sinh THPT.'
                  : 'Đề thi chọn lọc từ các Sở GD&ĐT, trường Chuyên và cụm liên trường toàn quốc. Hỗ trợ quét mã QR trao đổi file nguồn LaTeX nhanh chóng.'}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Tài liệu</div>
                <div className="text-sm font-bold text-blue-700">{docCount}</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Đề HSG</div>
                <div className="text-sm font-bold text-purple-700">{hsgCount}</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Đề TN THPT</div>
                <div className="text-sm font-bold text-emerald-700">{tnCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Google Drive Automatic Folder Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                savedFolderInfo
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}
            >
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900">
                  {savedFolderInfo
                    ? 'Thư Mục Google Drive Đang Lưu Trữ Tự Động'
                    : 'Tự Động Tạo Thư Mục Trên Google Drive'}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    savedFolderInfo
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {savedFolderInfo ? 'Đang hoạt động' : 'Tự động lưu'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {savedFolderInfo ? (
                  <>
                    Thư mục: <strong className="text-blue-800 font-semibold">{savedFolderInfo.name}</strong> • Hệ thống tự động ghi nhớ và đồng bộ tài liệu Toán THPT của Thầy.
                  </>
                ) : (
                  'Tự động tạo 1 thư mục riêng trên Google Drive của Thầy để lưu trữ và quản lý tài liệu, tự động nhớ trên thiết bị.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {savedFolderInfo?.webViewLink && (
              <a
                href={savedFolderInfo.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Mở Trên Drive</span>
              </a>
            )}
            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{savedFolderInfo ? 'Quản Lý Thư Mục' : 'Tạo Thư Mục Tự Động'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Filter Bar */}
        <FilterBar
          activeNavTab={activeNavTab}
          examSubTag={examSubTag}
          onExamSubTagChange={setExamSubTag}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGrade={selectedGrade}
          onGradeChange={setSelectedGrade}
          selectedTopic={selectedTopic}
          onTopicChange={setSelectedTopic}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={filteredDocuments.length}
        />

        {/* Admin Clean Bar */}
        {userRole === 'admin' && documents.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 bg-amber-50/80 border border-amber-200 rounded-2xl px-4 py-2.5 text-xs text-amber-950">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Chế độ Quản trị: Đang có {documents.length} tài liệu trong hệ thống
            </span>
            <button
              id="admin-clear-all-btn"
              onClick={handleClearAllDocuments}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Xóa sạch các file tạm hoặc file thử nghiệm lỗi"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Dọn dẹp sạch file tạm / lỗi</span>
            </button>
          </div>
        )}

        {/* Documents Cards Grid (Responsive: 1 col mobile, 2 col tablet, 3 col desktop) */}
        {filteredDocuments.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/80">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Trang tổng quan: Hiển thị trực tiếp Trang 1 của mỗi tài liệu</span>
                </span>
                <span className="hidden sm:inline text-slate-400">• Bấm vào thẻ để xem toàn bộ các trang</span>
              </div>
              <span className="text-slate-500 font-medium">
                Tìm thấy <strong>{filteredDocuments.length}</strong> tài liệu
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDocuments.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onOpenQR={setQrDoc}
                  onOpenDetail={setDetailDoc}
                  onDownload={handleDownload}
                  onPreview={setPreviewDoc}
                  onDelete={handleDeleteDocument}
                  userRole={userRole}
                />
              ))}
            </div>
          </div>
        ) : documents.length === 0 ? (
          /* Empty Library State when all mock documents are removed */
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center max-w-lg mx-auto my-10 shadow-xs">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1.5">
              Thư viện hiện chưa có tài liệu
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed max-w-sm mx-auto">
              Đã xóa toàn bộ 4 tài liệu và 4 đề thi mẫu thành công. Thầy Long có thể bấm nút bên dưới để tải lên tài liệu và đề thi Toán chính thức mới.
            </p>
            {userRole === 'admin' ? (
              <button
                id="empty-state-upload-btn"
                onClick={() => setIsAdminUploadOpen(true)}
                className="px-6 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md shadow-blue-700/20 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tải Lên Tài Liệu / Đề Thi Mới</span>
              </button>
            ) : (
              <button
                id="empty-state-switch-admin-btn"
                onClick={toggleUserRole}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2 mx-auto cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Chuyển Sang Vai Trò Admin Để Tải Lên</span>
              </button>
            )}
          </div>
        ) : (
          /* Empty Search Results State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Không tìm thấy tài liệu phù hợp</h3>
            <p className="text-xs text-slate-500 mb-4">
              Không có tài liệu hoặc đề thi nào khớp với từ khóa "{searchQuery}" trong bộ lọc hiện tại.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGrade('all');
                setSelectedTopic('Tất cả chuyên đề');
                setExamSubTag('all');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        )}

        {/* Feature Value Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Hỗ Trợ Giáo Viên & Học Sinh Toàn Quốc
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-white">
                Cần File Nguồn LaTeX (.tex) Để Soạn Đề Hoặc Giảng Dạy?
              </h3>
              <p className="text-xs md:text-sm text-blue-200 leading-relaxed">
                Mỗi tài liệu trên website đều được gắn sẵn <strong>Mã QR kết nối trực tiếp</strong>. Thầy/Cô chỉ cần quét mã QR bằng Zalo để nhận file nguồn LaTeX (.tex) kèm hình vẽ chuẩn PGF/TikZ từ tác giả.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsAuthorModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm transition-colors shadow-lg flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Xem Mã QR Tác Giả</span>
              </button>

              <button
                onClick={() => setIsDesignSpecOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 border border-white/20"
              >
                <Layers className="w-4 h-4 text-blue-300" />
                <span>Hồ Sơ Thiết Kế UI/UX</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Mandated Copyright & Author Information */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Top Brand Header */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-xs p-1 flex items-center justify-center shrink-0">
              <PersonalLogo className="w-full h-full" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900">Toán THPT Portal</span>
              <p className="text-xs text-slate-500">Cổng thư viện tài liệu & đề thi Toán học chuẩn GDPT 2018</p>
            </div>
          </div>

          {/* Section: Thông Tin Tác Giả & Bản Quyền cùng với thông tin bản quyền và mã QR phía bên phải */}
          <div className="bg-gradient-to-r from-blue-50/90 via-white to-blue-50/60 border-2 border-blue-200 rounded-3xl p-6 md:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            {/* Left Side: Thông Tin Tác Giả & Bản Quyền */}
            <div className="space-y-2 text-left flex-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-100/80 border border-blue-200 px-3 py-1 rounded-full">
                <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                Thông Tin Tác Giả & Bản Quyền
              </div>
              <h4 className="text-base md:text-lg font-extrabold text-slate-900">
                Website này thuộc Bản quyền của Lê Ngọc Long
              </h4>
              <p className="text-xs md:text-sm font-medium text-slate-700">
                Tác giả: <strong>Lê Ngọc Long</strong> • Hỗ trợ học tập & Chia sẻ mã nguồn LaTeX
              </p>
            </div>

            {/* Right Side: Phía bên phải là mã QR thôi */}
            <div className="shrink-0 flex flex-col items-center justify-center gap-1.5">
              <div
                onClick={() => setIsAuthorModalOpen(true)}
                className="cursor-pointer group p-2 bg-white rounded-2xl border-2 border-blue-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all"
                title="Bấm để phóng to mã QR Zalo của Tác giả Lê Ngọc Long"
              >
                <img
                  src="/author-zalo-qr.svg"
                  alt="Mã QR Zalo Tác giả Lê Ngọc Long"
                  className="w-28 h-28 md:w-32 md:h-32 rounded-lg object-contain group-hover:scale-102 transition-transform"
                />
              </div>
              <a
                href="https://zaloapp.com/qr/p/1jw57gmjskxkn"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>Mở Zalo Tác Giả</span>
              </a>
            </div>
          </div>

          {/* Bottom links */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              © 2025 - 2026 <strong>Lê Ngọc Long</strong>. Mọi quyền được bảo lưu. Tự động phân loại tài liệu với Gemini AI.
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://zaloapp.com/qr/p/1jw57gmjskxkn"
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:underline font-bold"
              >
                Zalo Tác Giả
              </a>
              <span>•</span>
              <button
                onClick={() => setIsAuthorModalOpen(true)}
                className="text-blue-700 hover:underline font-bold"
              >
                Mã QR Tác Giả
              </button>
              <span>•</span>
              <button
                onClick={() => setIsDesignSpecOpen(true)}
                className="text-blue-700 hover:underline font-semibold"
              >
                Hồ sơ UI/UX Design
              </button>
              <span>•</span>
              <button
                onClick={() => setIsAdminUploadOpen(true)}
                className="text-blue-700 hover:underline font-semibold"
              >
                Khu vực Quản trị (Upload)
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QRCodeModal document={qrDoc} onClose={() => setQrDoc(null)} />
      <DocumentDetailModal
        document={detailDoc}
        onClose={() => setDetailDoc(null)}
        onDownload={handleDownload}
        onPreview={setPreviewDoc}
        onDelete={handleDeleteDocument}
        userRole={userRole}
      />
      <DocumentPreviewModal
        document={previewDoc}
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        onDownload={handleDownload}
        onOpenQR={setQrDoc}
      />
      <AdminUploadModal
        isOpen={isAdminUploadOpen}
        onClose={() => setIsAdminUploadOpen(false)}
        onDocumentCreated={handleDocumentCreated}
        savedFolderInfo={savedFolderInfo}
        accessToken={accessToken}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
      />
      <DesignSpecModal
        isOpen={isDesignSpecOpen}
        onClose={() => setIsDesignSpecOpen(false)}
      />
      <AuthorModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
      />
      <GoogleDriveSyncModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        currentUser={currentUser}
        accessToken={accessToken}
        onAuthSuccess={(user, token) => {
          setCurrentUser(user);
          setAccessToken(token);
        }}
        onLogout={handleLogout}
        documents={documents}
        savedFolderInfo={savedFolderInfo}
        onFolderUpdated={handleFolderUpdated}
      />
    </div>
  );
}
