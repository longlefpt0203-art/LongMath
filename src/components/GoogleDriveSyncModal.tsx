import React, { useState, useEffect } from 'react';
import {
  X,
  FolderPlus,
  Cloud,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  LogOut,
  Folder,
  FileCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logout } from '../services/firebaseAuth';
import {
  autoEnsureDriveFolder,
  saveDocumentToDrive,
  DriveFolderInfo,
  DRIVE_DEFAULT_FOLDER_NAME,
} from '../services/googleDriveService';
import { DocumentItem } from '../types';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  accessToken: string | null;
  onAuthSuccess: (user: User, token: string) => void;
  onLogout: () => void;
  documents: DocumentItem[];
  savedFolderInfo: DriveFolderInfo | null;
  onFolderUpdated: (folder: DriveFolderInfo) => void;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  accessToken,
  onAuthSuccess,
  onLogout,
  documents,
  savedFolderInfo,
  onFolderUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number } | null>(null);

  // Khi người dùng đăng nhập thành công và chưa có thư mục, tự động tạo thư mục
  useEffect(() => {
    if (isOpen && currentUser && accessToken && !savedFolderInfo && !loading) {
      handleAutoCreateFolder(accessToken);
    }
  }, [isOpen, currentUser, accessToken, savedFolderInfo]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleSignIn();
      onAuthSuccess(res.user, res.accessToken);
      // Ngay sau khi đăng nhập, tự động tạo thư mục trên Google Drive
      await handleAutoCreateFolder(res.accessToken);
    } catch (err: any) {
      setError(err.message || 'Không thể đăng nhập tài khoản Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoCreateFolder = async (token: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const folder = await autoEnsureDriveFolder(token);
      onFolderUpdated(folder);
      if (folder.isNewlyCreated) {
        setSuccessMessage(`Đã tự động tạo mới thư mục "${folder.name}" trên Google Drive của bạn!`);
      } else {
        setSuccessMessage(`Đã kết nối và tự động nhận diện thư mục "${folder.name}" trên Google Drive.`);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tạo thư mục trên Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAllDocuments = async () => {
    if (!accessToken || !savedFolderInfo) {
      setError('Vui lòng kết nối Google Drive trước khi đồng bộ tài liệu.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setSyncProgress({ current: 0, total: documents.length });

    try {
      for (let i = 0; i < documents.length; i++) {
        await saveDocumentToDrive(accessToken, savedFolderInfo.id, documents[i]);
        setSyncProgress({ current: i + 1, total: documents.length });
      }
      setSuccessMessage(`Đã tự động lưu thành công toàn bộ ${documents.length} tài liệu vào thư mục Google Drive!`);
    } catch (err: any) {
      setError(err.message || 'Xảy ra lỗi trong quá trình lưu tài liệu lên Google Drive.');
    } finally {
      setLoading(false);
      setSyncProgress(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 relative">
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-xs">
              <Cloud className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">Google Drive Tự Động</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                  Tự Động Lưu Trữ
                </span>
              </div>
              <p className="text-xs text-blue-100/90">
                Tự động tạo thư mục riêng và lưu trữ tài liệu Toán THPT an toàn
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Đã có lỗi xảy ra</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Thành công</p>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          {/* Chưa đăng nhập Google */}
          {!currentUser ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-700">
                <FolderPlus className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-base text-slate-900">
                  Kết Nối Google Drive Của Bạn
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Chỉ cần đăng nhập 1 lần, hệ thống sẽ <strong>tự động tạo thư mục riêng</strong> trên Google Drive của bạn để lưu toàn bộ tài liệu và đề thi Toán học.
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                {/* Official styled Google Sign In button */}
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="px-6 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 shadow-sm text-slate-700 font-bold text-sm transition-all flex items-center gap-3 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                  )}
                  <span>Đăng nhập với Google để Tự Động Tạo Thư Mục</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bảo mật tuyệt đối: Ứng dụng chỉ có quyền tạo và quản lý thư mục tài liệu của ứng dụng</span>
              </div>
            </div>
          ) : (
            /* Đã đăng nhập */
            <div className="space-y-4">
              {/* Account Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Avatar'}
                      className="w-10 h-10 rounded-full border border-slate-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      {currentUser.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">
                      {currentUser.displayName || 'Tài khoản Google'}
                    </p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>

              {/* Status Thư Mục Tự Động */}
              {savedFolderInfo ? (
                <div className="p-4 rounded-2xl bg-blue-50/80 border-2 border-blue-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Folder className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-blue-950">
                            Thư Mục Tự Động Trên Drive
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                            Đã Sẵn Sàng
                          </span>
                        </div>
                        <p className="text-xs font-bold text-blue-800 line-clamp-1">
                          {savedFolderInfo.name}
                        </p>
                      </div>
                    </div>

                    {savedFolderInfo.webViewLink && (
                      <a
                        href={savedFolderInfo.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Mở Drive</span>
                      </a>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600">
                    Mã thư mục: <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-slate-700 font-mono">{savedFolderInfo.id}</code>
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold">Đang tự động khởi tạo thư mục...</p>
                    <p className="text-[11px]">Hệ thống đang kiểm tra và tạo thư mục trên Drive</p>
                  </div>
                  {accessToken && (
                    <button
                      onClick={() => handleAutoCreateFolder(accessToken)}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      <span>Thử lại</span>
                    </button>
                  )}
                </div>
              )}

              {/* Đồng Bộ Tài Liệu Vào Thư Mục */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    Tự Động Lưu Tài Liệu Vào Thư Mục Này
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {documents.length} tài liệu hiện có
                  </span>
                </div>

                {syncProgress && (
                  <div className="space-y-1 p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="flex justify-between text-xs font-bold text-blue-900">
                      <span>Đang lưu lên Drive...</span>
                      <span>{syncProgress.current}/{syncProgress.total}</span>
                    </div>
                    <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSyncAllDocuments}
                  disabled={loading || !savedFolderInfo}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs md:text-sm transition-all shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  )}
                  <span>
                    {loading ? 'Đang lưu tài liệu...' : 'Tự Động Lưu Toàn Bộ Tài Liệu Vào Drive'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tự động nhớ thư mục trên thiết bị</span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
