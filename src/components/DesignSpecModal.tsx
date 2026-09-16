import React, { useState } from 'react';
import {
  Layers,
  Layout,
  Palette,
  GitBranch,
  Cpu,
  X,
  CheckCircle2,
  Download,
  QrCode,
  Sparkles,
  Search,
  BookOpen,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface DesignSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSpecModal: React.FC<DesignSpecModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'wireframe' | 'ui' | 'userflow' | 'tech'>('structure');

  if (!isOpen) return null;

  return (
    <div
      id="design-spec-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="design-spec-modal-container"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden relative"
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              📐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">Hồ Sơ Thiết Kế UI/UX & Product Design</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Version 1.0 • Chuẩn Toán THPT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Đặc tả chi tiết 5 phần: Cấu trúc trang, Wireframe, UI Tokens, Luồng người dùng & Công nghệ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'structure'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Cấu trúc trang</span>
          </button>

          <button
            onClick={() => setActiveTab('wireframe')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wireframe'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>2. Wireframe mô tả</span>
          </button>

          <button
            onClick={() => setActiveTab('ui')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ui'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>3. Thành phần UI quan trọng</span>
          </button>

          <button
            onClick={() => setActiveTab('userflow')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'userflow'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>4. Luồng người dùng (User Flow)</span>
          </button>

          <button
            onClick={() => setActiveTab('tech')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tech'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>5. Gợi ý công nghệ</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6 text-slate-800 text-sm">
          {/* TAB 1: CẤU TRÚC TRANG */}
          {activeTab === 'structure' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">1. Cấu trúc tổng thể & Kiến trúc thông tin (IA)</h4>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Website được tinh giản với cấu trúc <strong>2 thành tố chính (Primary Tabs)</strong> phục vụ tối đa trải nghiệm tra cứu và tải tài liệu nhanh của Học sinh & Giáo viên Toán THPT:
                </p>
              </div>

              {/* Hierarchy Tree Visual */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Sơ đồ phân cấp (Information Hierarchy):
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Branch 1 */}
                  <div className="bg-white p-4 rounded-xl border-l-4 border-blue-600 border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-blue-800 text-base flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        Tab 1: TÀI LIỆU
                      </span>
                      <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        Lý thuyết & Chuyên đề
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      Bao gồm: Chuyên đề lý thuyết chuyên sâu, tóm tắt công thức, bài tập trắc nghiệm phân dạng 4 mức độ nhận thức, tài liệu ôn thi THPT Quốc gia theo chương trình mới GDPT 2018.
                    </p>
                    <div className="text-xs space-y-1 text-slate-500 font-mono">
                      <div>• Lọc theo khối: Lớp 10 / Lớp 11 / Lớp 12 / Toàn cấp</div>
                      <div>• Lọc theo chuyên đề: Hàm số, Oxyz, Tích phân, Số phức, Xác suất...</div>
                    </div>
                  </div>

                  {/* Branch 2 */}
                  <div className="bg-white p-4 rounded-xl border-l-4 border-indigo-600 border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-indigo-800 text-base flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-600" />
                        Tab 2: ĐỀ THI
                      </span>
                      <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                        2 Sub-tags chính
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      Được phân định rõ ràng thành 2 phân hệ khảo thí quan trọng nhất của bậc THPT:
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="bg-purple-50 border border-purple-100 p-2 rounded-lg text-purple-900 font-medium">
                        <strong>🏷️ Sub-tag 1: Đề thi HSG</strong> (Học sinh giỏi cấp trường, tỉnh, thành phố, cụm chuyên, Olympic 30/4)
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-emerald-900 font-medium">
                        <strong>🏷️ Sub-tag 2: Đề thi TN THPT</strong> (Đề tốt nghiệp chính thức, đề tham khảo BGD, đề thi thử liên trường format mới)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-elements layout */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-800">Các trang & màn hình chính trong hệ thống:</div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>Trang chủ / Danh sách tài liệu & Đề thi:</strong> Thanh tìm kiếm tức thời, bộ lọc tag trực quan, lưới hiển thị card tài liệu đa thông tin.</li>
                    <li><strong>Modal / Trang Chi Tiết Tài Liệu:</strong> Xem trước trích đoạn đề, bảng mục lục, nút Tải PDF và khối mã QR giao lưu LaTeX.</li>
                    <li><strong>Modal Mã QR Liên Hệ Admin:</strong> Sinh mã QR độc nhất kèm mã LTX-XXXX kết nối trực tiếp Zalo/Telegram.</li>
                    <li><strong>Trang / Modal Upload Admin:</strong> Kéo thả file PDF, tích hợp Gemini AI phân tích nội dung, tự động tạo tiêu đề SEO và phân loại.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WIREFRAME MÔ TẢ */}
          {activeTab === 'wireframe' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">2. Wireframe mô tả bố cục (Layout Wireframes)</h4>
                <p className="text-slate-600 text-xs md:text-sm">
                  Mô phỏng trực quan wireframe của các màn hình trọng tâm theo chuẩn tỷ lệ và cấu trúc khối:
                </p>
              </div>

              {/* Wireframe 1: Desktop Main View */}
              <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto shadow-inner">
                <div className="text-blue-400 font-bold mb-2">// 2.1 WIREFRAME TRANG CHỦ & DANH SÁCH (DESKTOP)</div>
{`+--------------------------------------------------------------------------------------------------+
| [LOGO: TOÁN THPT]   [Tab: TÀI LIỆU]   [Tab: ĐỀ THI (HSG / TN THPT)]       [🔍 Tìm kiếm]  [⚡ Admin Upload] |
+--------------------------------------------------------------------------------------------------+
| BANNER NHẬN DIỆN: "Thư Viện Tài Liệu & Đề Thi Toán THPT Chuẩn Mực - Tải PDF & Trao Đổi Mã Nguồn LaTeX"  |
|                                                                                                  |
| [Sub-filter Tags]: (o) Tất cả đề thi     ( ) Đề thi HSG      ( ) Đề thi TN THPT                  |
| [Bộ lọc phụ]:      [Khối Lớp: 10/11/12]  [Chuyên đề: Hàm số/Oxyz/...]  [Sắp xếp: Mới nhất / Hot] |
+--------------------------------------------------------------------------------------------------+
| LƯỚI CARD TÀI LIỆU (3 CỘT TRÊN DESKTOP, 1 CỘT MOBILE):                                           |
|                                                                                                  |
| +--------------------------------+ +--------------------------------+ +------------------------+ |
| | [Badge: Đề thi HSG] [Lớp 12]  | | [Badge: TN THPT] [Lớp 12]      | | [Badge: Tài liệu] [12] | |
| | Tiêu đề chuẩn SEO (2 dòng)     | | Tiêu đề chuẩn SEO (2 dòng)     | | Tiêu đề chuẩn SEO      | |
| | Tóm tắt nội dung (2-4 câu):    | | Tóm tắt nội dung (2-4 câu):    | | Tóm tắt nội dung       | |
| | "Đề thi HSG tỉnh Nam Định..."  | | "Đề thi thử tốt nghiệp 2025..."| | "Chuyên đề Oxyz..."    | |
| | #Toán 12  #Bất đẳng thức       | | #Format mới  #Có lời giải      | | #Vector  #Không gian   | |
| | 14 trang • 3.2 MB • 4.8k tải   | | 12 trang • 2.9 MB • 6.1k tải   | | 42 trang • 5.1 MB      | |
| | [📥 Nút: Tải tài liệu]        | | [📥 Nút: Tải tài liệu]        | | [📥 Tải tài liệu]     | |
| | [📱 Nút: Mã QR liên hệ Admin]  | | [📱 Nút: Mã QR liên hệ Admin]  | | [📱 Mã QR liên hệ]    | |
| +--------------------------------+ +--------------------------------+ +------------------------+ |
+--------------------------------------------------------------------------------------------------+`}
              </div>

              {/* Wireframe 2: Detail Modal & Admin Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto">
                  <div className="text-emerald-400 font-bold mb-2">// 2.2 WIREFRAME CARD & DETAIL POPUP</div>
{`+------------------------------------------------+
| [Breadcrumb: Toán THPT / Đề thi / LTX-1201] [X]|
| TIÊU ĐỀ ĐẦY ĐỦ CHUẨN SEO CỦA TÀI LIỆU          |
| [Badge: HSG] [Lớp 12] [Độ khó: 9+]             |
+------------------------------------------------+
| KHỐI TÓM TẮT 2-4 CÂU (AI GENERATED HIGHLIGHT): |
| "Bộ đề gồm 5 câu tự luận bao quát bất đẳng thức|
| đối xứng, hình học không gian và phương trình..|
| Thích hợp cho đội tuyển HSG rèn luyện..."      |
+------------------------------------------------+
| [Cột trái: 2/3]          | [Cột phải: 1/3]     |
| • Dung lượng / Số trang  | +-----------------+ |
| • Mục lục chi tiết       | | [📥 TẢI PDF]    | |
| • Trích đoạn câu hỏi mẫu | +-----------------+ |
| • Tags từ khóa tra cứu   | | [KHỐI MÃ QR]    | |
|                          | | [  Ảnh QR Code ]| |
|                          | | Mã: LTX-HSG-25  | |
|                          | | [Zalo Thầy Admin| |
|                          | +-----------------+ |
+------------------------------------------------+`}
                </div>

                <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto">
                  <div className="text-purple-400 font-bold mb-2">// 2.3 WIREFRAME ADMIN UPLOAD (AI POWERED)</div>
{`+------------------------------------------------+
| CỔNG ADMIN UPLOAD TÀI LIỆU PDF             [X] |
+------------------------------------------------+
| [KHU VỰC KÉO THẢ TỆP PDF]                      |
| "Kéo thả file PDF vào đây hoặc duyệt tệp"     |
| [Thử nghiệm nhanh: Đề HSG / TN THPT / Chuyên đề] |
+------------------------------------------------+
| [Khi tải tệp lên -> AI tự động kích hoạt]:     |
| >> Đang đọc file PDF...                        |
| >> Gemini AI phân tích nội dung toán học...    |
+------------------------------------------------+
| KẾT QUẢ TỰ ĐỘNG SINH (ADMIN KHÔNG NHẬP TAY):  |
| 1. Tên hiển thị SEO: [Tự động điền]           |
| 2. Tóm tắt 2-4 câu:  [Tự động điền]           |
| 3. Phân loại mục:    [Tự động: Đề thi HSG]    |
| 4. Khối lớp & Chủ đề:[Tự động: 12 - BĐT]      |
| 5. Mã trao đổi LaTeX:[Tự động: LTX-TOAN-XXXX] |
+------------------------------------------------+
| [Nút: Hủy]      [Nút: XUẤT BẢN LÊN WEBSITE 🚀] |
+------------------------------------------------+`}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: THÀNH PHẦN UI */}
          {activeTab === 'ui' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">3. Các thành phần UI quan trọng & Design System</h4>
                <p className="text-slate-600 text-xs md:text-sm">
                  Định hình ngôn ngữ thiết kế: Hiện đại, sạch sẽ, học thuật toán học, áp dụng nguyên lý công thái học (Ergonomics) và loại bỏ hoàn toàn các mẫu sáo rỗng (Anti-Slop):
                </p>
              </div>

              {/* Color Palette Tokens */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Bảng màu chủ đạo (Primary Educational Color Tokens)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="w-full h-10 rounded bg-blue-700 mb-1.5 shadow-xs"></div>
                    <div className="font-bold text-xs text-slate-800">Deep Math Blue</div>
                    <div className="text-[11px] font-mono text-slate-500">#1D4ED8</div>
                    <div className="text-[10px] text-slate-400">Header & Primary CTA</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="w-full h-10 rounded bg-blue-500 mb-1.5 shadow-xs"></div>
                    <div className="font-bold text-xs text-slate-800">Accent Blue</div>
                    <div className="text-[11px] font-mono text-slate-500">#3B82F6</div>
                    <div className="text-[10px] text-slate-400">Hover & Icons</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="w-full h-10 rounded bg-slate-900 mb-1.5 shadow-xs"></div>
                    <div className="font-bold text-xs text-slate-800">Slate Charcoal</div>
                    <div className="text-[11px] font-mono text-slate-500">#0F172A</div>
                    <div className="text-[10px] text-slate-400">Heading & Contrast text</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="w-full h-10 rounded bg-slate-100 mb-1.5 border border-slate-200"></div>
                    <div className="font-bold text-xs text-slate-800">Cool Neutral Gray</div>
                    <div className="text-[11px] font-mono text-slate-500">#F1F5F9</div>
                    <div className="text-[10px] text-slate-400">Card backgrounds & Tags</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="w-full h-10 rounded bg-white mb-1.5 border border-slate-300"></div>
                    <div className="font-bold text-xs text-slate-800">Pure Paper White</div>
                    <div className="text-[11px] font-mono text-slate-500">#FFFFFF</div>
                    <div className="text-[10px] text-slate-400">Surface & Reader Cards</div>
                  </div>
                </div>
              </div>

              {/* Component breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Card Tài Liệu & Đề Thi
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Thiết kế viền mỏng 1px với tỷ lệ bo góc 16px (radius), tỷ lệ padding ngoài 20px, loại bỏ đổ bóng nhòe mờ.
                    Bố trí 2 nút bấm riêng biệt ở chân card:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    <li><strong>Nút Tải tài liệu:</strong> Nút chính màu xanh dương nổi bật, kích thước bấm tối thiểu 44px trên di động.</li>
                    <li><strong>Nút Mã QR:</strong> Nút phụ viền trắng/xám giúp mở modal quét QR tức thì mà không cần chuyển trang.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-indigo-600" />
                    Hệ Thống Mã QR & Trao Đổi LaTeX
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Mã QR vector được tạo động từ mã nhận diện tài liệu (VD: <code>LTX-TOAN-1201</code>).
                    Khi người dùng quét bằng điện thoại:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    <li>Tự động mở Zalo/Telegram đến hotline của Thầy/Cô Admin.</li>
                    <li>Điền sẵn nội dung yêu cầu file nguồn LaTeX (.tex) tương ứng.</li>
                    <li>Tạo cộng đồng chia sẻ tư liệu học thuật phi lợi nhuận giữa các giáo viên Toán cả nước.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LUỒNG NGƯỜI DÙNG */}
          {activeTab === 'userflow' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">4. Luồng người dùng (User Flow) của Khách & Admin</h4>
                <p className="text-slate-600 text-xs md:text-sm">
                  Được tối ưu hóa tối đa hành trình để giảm thiểu số bước thao tác (Zero Friction):
                </p>
              </div>

              {/* Flow 1: Admin */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">A</span>
                  Luồng Quản Trị Viên (Admin Upload Flow - AI Automated)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-blue-700 mb-1">Bước 1: Kéo thả file PDF</div>
                    <p className="text-slate-600">Admin chọn file đề thi hoặc chuyên đề từ máy tính.</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-blue-700 mb-1">Bước 2: AI đọc & phân tích</div>
                    <p className="text-slate-600">Gemini 3.8 Flash quét văn bản, nhận dạng đề HSG / TN THPT / Tài liệu.</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-blue-700 mb-1">Bước 3: Tự động điền dữ liệu</div>
                    <p className="text-slate-600">Sinh tiêu đề SEO, tóm tắt 2-4 câu, phân loại tag. Admin không cần nhập tay!</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-blue-700 mb-1">Bước 4: Xuất bản 1-Click</div>
                    <p className="text-slate-600">Bấm xác nhận, tài liệu xuất hiện ngay trên trang người dùng.</p>
                  </div>
                </div>
              </div>

              {/* Flow 2: Visitor */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">U</span>
                  Luồng Học Sinh & Giáo Viên (Visitor / User Flow)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-indigo-700 mb-1">1. Chọn Tab & Sub-tag</div>
                    <p className="text-slate-600">Chuyển giữa "Tài liệu" hoặc "Đề thi" (HSG vs TN THPT).</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-indigo-700 mb-1">2. Tìm & Đọc Tóm Tắt</div>
                    <p className="text-slate-600">Đọc ngay 2-4 câu mô tả để xác định tài liệu có phù hợp không.</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-indigo-700 mb-1">3. Tải PDF Miễn Phí</div>
                    <p className="text-slate-600">1 click tải ngay file PDF về máy tính/điện thoại để in ấn.</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-indigo-700 mb-1">4. Quét QR Trao Đổi LaTeX</div>
                    <p className="text-slate-600">Quét mã QR liên hệ Thầy Admin nhận file .tex khi có nhu cầu.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GỢI Ý CÔNG NGHỆ */}
          {activeTab === 'tech' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">5. Gợi ý Kiến trúc Công nghệ đề xuất (Tech Stack Architecture)</h4>
                <p className="text-slate-600 text-xs md:text-sm">
                  Kiến trúc tối ưu hiệu năng, chi phí vận hành thấp và khả năng mở rộng hàng chục ngàn tệp tài liệu:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                  <div className="font-bold text-sm text-blue-800">Frontend & Giao diện người dùng</div>
                  <ul className="space-y-1.5 text-slate-700">
                    <li>• <strong>Framework:</strong> Next.js 15 (App Router) hoặc Vite React SPA với SSR/SSG chuẩn SEO.</li>
                    <li>• <strong>Styling:</strong> Tailwind CSS v4 cho layout siêu nhẹ, nhất quán token màu toán học.</li>
                    <li>• <strong>Rendering Công thức Toán:</strong> KaTeX hoặc MathJax để hiển thị công thức LaTeX mượt mà.</li>
                    <li>• <strong>QR Engine:</strong> Thư viện <code>qrcode</code> render SVG sắc nét không vỡ hạt.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                  <div className="font-bold text-sm text-indigo-800">Backend & AI Pipeline</div>
                  <ul className="space-y-1.5 text-slate-700">
                    <li>• <strong>Mô hình AI:</strong> <code>Gemini 3.8 Flash</code> qua <code>@google/genai</code> SDK server-side (tốc độ cao, chi phí rẻ, đọc hiểu tiếng Việt xuất sắc).</li>
                    <li>• <strong>PDF Parser:</strong> <code>pdf-parse</code> hoặc <code>pdfjs-dist</code> để trích xuất văn bản trước khi đưa vào LLM.</li>
                    <li>• <strong>Lưu trữ File PDF & LaTeX:</strong> Cloudflare R2 / AWS S3 / Firebase Storage với CDN toàn cầu.</li>
                    <li>• <strong>Cơ sở dữ liệu:</strong> PostgreSQL (Supabase / Cloud SQL) hoặc Firestore lưu trữ metadata tài liệu.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900">
                <strong>💡 Điểm sáng thiết kế:</strong> Nhờ quy trình AI tự động hóa hoàn toàn ở khâu Admin Upload, Admin chỉ mất chưa đầy 3 giây để xuất bản một tài liệu PDF chuẩn SEO lên hệ thống, tiết kiệm 95% thời gian nhập liệu thủ công thông thường.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tài liệu thiết kế bởi Product & UI/UX Designer</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 font-semibold transition-colors"
          >
            Đóng bảng đặc tả
          </button>
        </div>
      </div>
    </div>
  );
};
