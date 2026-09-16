import React, { useState } from 'react';
import {
  X,
  Eye,
  Download,
  FileText,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BookOpen,
  Award,
  QrCode,
  ShieldCheck,
  Maximize2,
  Minimize2,
  ExternalLink,
  Cloud,
  ScrollText,
  BookMarked,
  HelpCircle,
  Building2,
  ListOrdered,
  CheckCircle2,
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
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'flip' | 'scroll'>('flip');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  if (!isOpen || !document) return null;

  // Total pages to display - supports viewing ALL pages (e.g. 10, 16, 24, 36, 50 trang)
  const totalPages = Math.max(document.pages || 16, 1);

  // Helper to generate realistic, comprehensive content for ANY page from 1 to totalPages
  const renderPageDetails = (pageIdx: number) => {
    const pageNum = pageIdx + 1;

    // Page 1: Trang Bìa, Ma trận & Khung thông tin
    if (pageIdx === 0) {
      return (
        <div className="space-y-6">
          {/* Header Quốc hiệu / Đơn vị */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {document.institution || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO • TRƯỜNG THPT CHUYÊN'}
              </div>
              <div className="text-[11px] font-semibold text-blue-700 mt-0.5">
                {document.examName || 'KỲ THI KHẢO SÁT CHẤT LƯỢNG HỌC KỲ & TỐT NGHIỆP THPT'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                MÃ ĐỀ: {document.latexExchangeCode}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Số trang: {totalPages} trang
              </div>
            </div>
          </div>

          {/* Title Box */}
          <div className="text-center py-4 bg-blue-50/60 rounded-2xl border border-blue-100">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white mb-2 shadow-xs">
              {document.category === 'tai-lieu'
                ? 'TÀI LIỆU CHUYÊN ĐỀ TOÁN HỌC'
                : document.category === 'de-thi-hsg'
                ? 'ĐỀ THI CHỌN HỌC SINH GIỎI'
                : 'ĐỀ THI CHÍNH THỨC TOÁN THPT'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug max-w-2xl mx-auto px-4">
              {document.title}
            </h1>
            <p className="text-xs text-slate-600 mt-2 font-medium">
              Môn thi: <strong>TOÁN HỌC</strong> • Khối: <strong>Lớp {document.grade}</strong> • Thời gian làm bài: <strong>90 phút</strong>
            </p>
            <p className="text-[11px] text-emerald-800 font-semibold mt-1">
              Cấu trúc: {document.questionCount || '50 câu hỏi trắc nghiệm (Phần I, II, III chuẩn 2025)'}
            </p>
          </div>

          {/* Student Info Box */}
          <div className="border border-dashed border-slate-300 rounded-xl p-3.5 bg-slate-50/70 text-xs flex flex-wrap justify-between gap-3 text-slate-600">
            <div>Họ và tên thí sinh: ........................................................................</div>
            <div>Số báo danh: ................................ Phòng thi: ..............</div>
          </div>

          {/* Summary & Ma trận */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Tóm tắt nội dung trọng tâm & Khung ma trận đề thi:
            </h4>
            <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
              {document.summary}
            </p>
          </div>

          {/* Mục lục cấu trúc */}
          {document.tableOfContents && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Mục lục phân bố đề thi & chuyên đề:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {document.tableOfContents.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-150">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Page 2: PHẦN I - Trắc nghiệm 4 lựa chọn (Câu 1 - Câu 6)
    if (pageIdx === 1) {
      return (
        <div className="space-y-6 text-xs text-slate-800">
          <div className="border-b border-slate-300 pb-2 flex items-center justify-between">
            <span className="font-bold text-blue-900 uppercase">PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN</span>
            <span className="text-[11px] text-slate-500 font-mono">Trang 2 / {totalPages}</span>
          </div>
          <p className="italic text-slate-600 text-[11px]">
            Thí sinh trả lời từ câu 1 đến câu 12. Mỗi câu hỏi thí sinh chỉ chọn một phương án.
          </p>

          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-slate-900">
                Câu 1. Cho hàm số y = f(x) có đồ thị liên tục trên R và có đạo hàm f'(x) = x(x - 2)^2(x + 1). Số điểm cực trị của hàm số đã cho là:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                <div>A. 1.</div>
                <div>B. 2.</div>
                <div>C. 3.</div>
                <div>D. 0.</div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-slate-900">
                Câu 2. Trong không gian Oxyz, cho hai điểm A(1; 2; -1) và B(3; 0; 1). Tọa độ trung điểm I của đoạn thẳng AB là:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                <div>A. I(2; 1; 0).</div>
                <div>B. I(4; 2; 0).</div>
                <div>C. I(1; -1; 1).</div>
                <div>D. I(2; -1; 1).</div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-slate-900">
                Câu 3. Biết hàm số F(x) là một nguyên hàm của f(x) = 3x^2 + 2x trên R thỏa mãn F(0) = 1. Giá trị của F(2) bằng:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                <div>A. 12.</div>
                <div>B. 13.</div>
                <div>C. 11.</div>
                <div>D. 15.</div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-slate-900">
                Câu 4. Một hộp chứa 5 quả cầu đỏ và 7 quả cầu xanh có kích thước như nhau. Lấy ngẫu nhiên đồng thời 2 quả cầu. Xác suất để lấy được 2 quả màu xanh là:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                <div>A. 7/22.</div>
                <div>B. 21/66.</div>
                <div>C. 35/132.</div>
                <div>D. 5/12.</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Page 3: PHẦN I (Tiếp theo) - Câu 7 đến Câu 12
    if (pageIdx === 2) {
      return (
        <div className="space-y-6 text-xs text-slate-800">
          <div className="border-b border-slate-300 pb-2 flex items-center justify-between">
            <span className="font-bold text-blue-900 uppercase">PHẦN I (TIẾP THEO) • VẬN DỤNG CƠ BẢN</span>
            <span className="text-[11px] text-slate-500 font-mono">Trang 3 / {totalPages}</span>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-slate-900">
                Câu 5. Trong không gian Oxyz, phương trình mặt phẳng (P) đi qua điểm M(1; -2; 3) và có vectơ pháp tuyến n = (2; -1; 4) là:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono">
                <div>A. 2x - y + 4z - 16 = 0.</div>
                <div>B. 2x - y + 4z + 16 = 0.</div>
                <div>C. x - 2y + 3z - 16 = 0.</div>
                <div>D. 2x - y + 4z - 14 = 0.</div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-slate-900">
                Câu 6. Diện tích hình phẳng giới hạn bởi đồ thị hàm số y = x^2 - 4x + 3 và trục hoành Ox bằng:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                <div>A. 4/3.</div>
                <div>B. 2/3.</div>
                <div>C. 8/3.</div>
                <div>D. 1/3.</div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-slate-900">
                Câu 7. Một doanh nghiệp sản xuất một loại sản phẩm với hàm tổng chi phí C(x) = 0.01x^3 - 0.6x^2 + 15x + 1000 (triệu đồng). Chi phí biên tại mức sản lượng x = 50 sản phẩm là:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                <div>A. 30 triệu.</div>
                <div>B. 25 triệu.</div>
                <div>C. 40 triệu.</div>
                <div>D. 15 triệu.</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Page 4: PHẦN II - Trắc nghiệm Đúng / Sai (Format 2025 mới)
    if (pageIdx === 3) {
      return (
        <div className="space-y-6 text-xs text-slate-800">
          <div className="border-b border-slate-300 pb-2 flex items-center justify-between">
            <span className="font-bold text-emerald-900 uppercase">PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI (4 Ý a, b, c, d)</span>
            <span className="text-[11px] text-slate-500 font-mono">Trang 4 / {totalPages}</span>
          </div>
          <p className="italic text-slate-600 text-[11px]">
            Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng (Đ) hoặc sai (S).
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-3">
              <p className="font-bold text-slate-900">
                Câu 1. Cho hàm số f(x) = (2x - 1)/(x + 1). Xét tính đúng sai của các mệnh đề sau:
              </p>
              <div className="space-y-1.5 pl-2 font-mono">
                <div className="p-1.5 bg-white rounded border border-emerald-150">a) Tập xác định của hàm số là D = R \ &#123;-1&#125;.</div>
                <div className="p-1.5 bg-white rounded border border-emerald-150">b) Đạo hàm f'(x) = 3/(x + 1)^2 &gt; 0 với mọi x thuộc D.</div>
                <div className="p-1.5 bg-white rounded border border-emerald-150">c) Tiệm cận ngang của đồ thị hàm số là đường thẳng y = 2.</div>
                <div className="p-1.5 bg-white rounded border border-emerald-150">d) Đồ thị hàm số nhận điểm I(-1; 2) làm tâm đối xứng.</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-3">
              <p className="font-bold text-slate-900">
                Câu 2. Trong không gian Oxyz, cho hình hộp chữ nhật ABCD.A'B'C'D' có A trùng gốc tọa độ O, các đỉnh B(2; 0; 0), D(0; 4; 0), A'(0; 0; 3).
              </p>
              <div className="space-y-1.5 pl-2 font-mono">
                <div className="p-1.5 bg-white rounded border border-emerald-150">a) Tọa độ đỉnh C' là (2; 4; 3).</div>
                <div className="p-1.5 bg-white rounded border border-emerald-150">b) Vectơ AC' có độ dài bằng căn bậc hai của 29.</div>
                <div className="p-1.5 bg-white rounded border border-emerald-150">c) Mặt phẳng (A'BD) có phương trình 6x + 3y + 4z - 12 = 0.</div>
                <div className="p-1.5 bg-white rounded border border-emerald-150">d) Khoảng cách từ C đến mặt phẳng (A'BD) bằng 12/căn(61).</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Page 5: PHẦN III - Trắc nghiệm trả lời ngắn (Format 2025 mới)
    if (pageIdx === 4) {
      return (
        <div className="space-y-6 text-xs text-slate-800">
          <div className="border-b border-slate-300 pb-2 flex items-center justify-between">
            <span className="font-bold text-purple-900 uppercase">PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN</span>
            <span className="text-[11px] text-slate-500 font-mono">Trang 5 / {totalPages}</span>
          </div>
          <p className="italic text-slate-600 text-[11px]">
            Thí sinh trả lời từ câu 1 đến câu 6. Thí sinh điền kết quả dạng số thập phân hoặc số nguyên vào ô trả lời.
          </p>

          <div className="space-y-4">
            <div className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-200 space-y-2">
              <p className="font-bold text-slate-900">
                Câu 1. Một bể chứa nước dạng hình trụ có thể tích V = 1600 m^3. Chi phí làm nắp và đáy là 300.000 đ/m^2, chi phí làm thân bể là 200.000 đ/m^2. Bán kính đáy r (làm tròn đến hàng phần mười của mét) để chi phí sản xuất thấp nhất là bao nhiêu?
              </p>
              <div className="p-2 bg-white rounded border border-purple-200 font-mono text-purple-900 font-bold">
                Đáp án câu 1: .................................
              </div>
            </div>

            <div className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-200 space-y-2">
              <p className="font-bold text-slate-900">
                Câu 2. Trong một đợt kiểm tra sức khỏe tại trường THPT, xác suất một học sinh cận thị là 0.6. Nếu một học sinh cận thị, xác suất đeo kính là 0.85. Chọn ngẫu nhiên 1 học sinh, xác suất học sinh đó không bị cận thị nhưng đeo kính thời trang là 0.05. Tính xác suất chọn được học sinh có đeo kính?
              </p>
              <div className="p-2 bg-white rounded border border-purple-200 font-mono text-purple-900 font-bold">
                Đáp án câu 2: .................................
              </div>
            </div>

            <div className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-200 space-y-2">
              <p className="font-bold text-slate-900">
                Câu 3. Tìm số giá trị nguyên của tham số m thuộc đoạn [-10; 10] để phương trình 4^x - m.2^(x+1) + 2m = 0 có hai nghiệm phân biệt?
              </p>
              <div className="p-2 bg-white rounded border border-purple-200 font-mono text-purple-900 font-bold">
                Đáp án câu 3: .................................
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Last Page: BẢNG ĐÁP ÁN CHÍNH THỨC & HƯỚNG DẪN CHẤM
    if (pageIdx === totalPages - 1) {
      return (
        <div className="space-y-6 text-xs text-slate-800">
          <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
            <span className="font-bold text-base text-slate-900 uppercase">BẢNG ĐÁP ÁN CHÍNH THỨC & THANG ĐIỂM CHI TIẾT</span>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              TRANG CUỐI ({totalPages}/{totalPages})
            </span>
          </div>

          {/* Đáp án Phần I */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-blue-900 uppercase">1. Bảng đáp án Phần I (Trắc nghiệm 4 phương án - 0.25đ / câu):</h4>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 font-mono text-center font-bold">
              {[
                { q: '1', a: 'B' }, { q: '2', a: 'A' }, { q: '3', a: 'B' }, { q: '4', a: 'A' },
                { q: '5', a: 'A' }, { q: '6', a: 'A' }, { q: '7', a: 'B' }, { q: '8', a: 'C' },
                { q: '9', a: 'D' }, { q: '10', a: 'B' }, { q: '11', a: 'C' }, { q: '12', a: 'A' },
              ].map((item) => (
                <div key={item.q} className="bg-white p-1.5 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-normal">C{item.q}</div>
                  <div className="text-blue-700">{item.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Đáp án Phần II */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
            <h4 className="font-bold text-emerald-950 uppercase">2. Bảng đáp án Phần II (Đúng / Sai theo thang điểm chuẩn 4 ý):</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="p-2 bg-white rounded border border-emerald-200">
                <span className="font-bold text-emerald-800">Câu 1:</span> a-Đ | b-Đ | c-Đ | d-Đ
              </div>
              <div className="p-2 bg-white rounded border border-emerald-200">
                <span className="font-bold text-emerald-800">Câu 2:</span> a-Đ | b-S | c-Đ | d-Đ
              </div>
              <div className="p-2 bg-white rounded border border-emerald-200">
                <span className="font-bold text-emerald-800">Câu 3:</span> a-S | b-Đ | c-Đ | d-S
              </div>
              <div className="p-2 bg-white rounded border border-emerald-200">
                <span className="font-bold text-emerald-800">Câu 4:</span> a-Đ | b-Đ | c-S | d-Đ
              </div>
            </div>
          </div>

          {/* Đáp án Phần III */}
          <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2">
            <h4 className="font-bold text-purple-950 uppercase">3. Bảng đáp án Phần III (Điền số ngắn - 0.5đ / câu):</h4>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 font-mono text-xs text-center">
              {[
                { q: '1', a: '5.2' }, { q: '2', a: '0.56' }, { q: '3', a: '8' },
                { q: '4', a: '12.5' }, { q: '5', a: '3' }, { q: '6', a: '1.73' },
              ].map((item) => (
                <div key={item.q} className="p-2 bg-white rounded border border-purple-200">
                  <div className="text-[10px] text-slate-400">Câu {item.q}</div>
                  <div className="font-bold text-purple-700">{item.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Author Note */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Biên soạn & Thẩm định: <strong>Thầy Lê Ngọc Long (FPT School)</strong></span>
            </div>
            <div>Mã lưu trữ LaTeX: <strong className="font-mono text-slate-800">{document.latexExchangeCode}</strong></div>
          </div>
        </div>
      );
    }

    // Intermediate Pages: Bài tập vận dụng cao & Hướng dẫn phương pháp
    return (
      <div className="space-y-6 text-xs text-slate-800">
        <div className="border-b border-slate-300 pb-2 flex items-center justify-between">
          <span className="font-bold text-blue-900 uppercase">
            CHUYÊN ĐỀ VẬN DỤNG CAO • TRANG {pageNum} / {totalPages}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Trang {pageNum}</span>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Nội dung phân tích & Câu hỏi phân hóa 8.5+ trang {pageNum}
          </h4>
          <p className="text-slate-700 leading-relaxed">
            {document.sampleQuestions?.[pageIdx % (document.sampleQuestions?.length || 1)] ||
              `Hệ thống câu hỏi và phương pháp giải nhanh chuyên sâu cho kỳ thi tốt nghiệp THPT. Tập trung vào kỹ thuật gắn trục tọa độ không gian Oxyz, tối ưu hóa bài toán thực tế cực trị và phương pháp đổi biến số tích phân.`}
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
            <p className="font-bold text-slate-900">
              Bài toán rèn luyện {pageNum}.1: Cho hình chóp S.ABCD có đáy ABCD là hình thang vuông tại A và B, AB = BC = a, AD = 2a. Cạnh bên SA vuông góc với đáy và SA = a*căn(2). Gọi M là trung điểm của AD.
            </p>
            <p className="text-slate-600 pl-2">
              a) Tính khoảng cách từ điểm B đến mặt phẳng (SCD).<br />
              b) Xác định cosin của góc tạo bởi hai mặt phẳng (SBC) và (SCD).
            </p>
            <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-150 font-mono">
              Hướng dẫn giải nhanh: Gắn hệ trục tọa độ Oxyz với O trùng A, tia Ox trùng AB, Oy trùng AD, Oz trùng AS...
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
            <p className="font-bold text-slate-900">
              Bài toán rèn luyện {pageNum}.2: Khảo sát sự hội tụ và tiệm cận xiên của đồ thị hàm phân thức bậc hai trên bậc nhất y = (ax^2 + bx + c)/(dx + e) áp dụng trong mô phỏng quỹ đạo bay.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      id="document-preview-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-1 sm:p-3 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="document-preview-modal-container"
        className={`bg-slate-900 text-white shadow-2xl border border-slate-700 flex flex-col overflow-hidden relative transition-all duration-200 ${
          isFullscreen
            ? 'fixed inset-0 z-50 rounded-none w-full h-full'
            : 'rounded-2xl md:rounded-3xl w-full max-w-5xl h-[94vh]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="bg-slate-800/95 border-b border-slate-700/90 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/20">
                  Xem Tất Cả Các Trang ({totalPages} Trang)
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {document.latexExchangeCode}
                </span>
              </div>
              <h2 className="text-sm md:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
                {document.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-700/80 p-0.5 rounded-xl border border-slate-600 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('flip')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'flip'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Xem từng trang A4"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>Lật Từng Trang</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('scroll')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'scroll'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Cuộn liền mạch tất cả các trang"
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span>Cuộn Tất Cả Trang</span>
              </button>
            </div>

            {/* Google Drive Link if exists */}
            {document.driveFileUrl && (
              <a
                href={document.driveFileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-600"
                title="Mở tài liệu này trực tiếp trên Google Drive"
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Drive</span>
              </a>
            )}

            {/* Direct Download Button */}
            <button
              id="preview-direct-download-btn"
              onClick={() => onDownload(document)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải PDF</span>
              <span>({document.fileSize})</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-9 h-9 rounded-xl bg-slate-700/70 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              id="preview-close-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-700/70 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Đóng cửa sổ xem trước"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Navigation & Page Selection Bar */}
        <div className="bg-slate-800/60 border-b border-slate-700/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 shrink-0">
          {/* Page Jump & Stepper */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPageIndex(0)}
              disabled={currentPageIndex === 0}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang đầu tiên (Trang 1)"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Direct Page Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 font-medium">Trang:</span>
              <select
                value={currentPageIndex}
                onChange={(e) => setCurrentPageIndex(Number(e.target.value))}
                className="bg-transparent text-white font-mono font-bold text-xs focus:outline-hidden cursor-pointer"
              >
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <option key={idx} value={idx} className="bg-slate-800 text-white">
                    {idx + 1} / {totalPages} {idx === 0 ? '(Trang bìa)' : idx === totalPages - 1 ? '(Đáp án)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPageIndex >= totalPages - 1}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPageIndex(totalPages - 1)}
              disabled={currentPageIndex >= totalPages - 1}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang cuối cùng (Bảng đáp án)"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>

            <span className="text-slate-400 text-[11px] hidden sm:inline ml-2">
              (Hỗ trợ xem toàn bộ <strong>{totalPages} trang</strong>)
            </span>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-mono cursor-pointer"
              title="Thu nhỏ kích thước trang"
            >
              -
            </button>
            <span className="font-mono text-xs text-slate-300 w-12 text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-mono cursor-pointer"
              title="Phóng to kích thước trang"
            >
              +
            </button>
          </div>
        </div>

        {/* Main Document Content Viewport */}
        <div className="flex-1 overflow-auto p-3 sm:p-6 md:p-8 bg-slate-950 flex justify-center items-start">
          {/* Case 1: Real PDF Uploaded -> Full interactive embed allowing full scrolling through ALL pages */}
          {document.fileDataUrl && viewMode === 'scroll' ? (
            <div
              className="w-full h-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <iframe
                src={`${document.fileDataUrl}#toolbar=1&navpanes=1`}
                title={document.title}
                className="w-full h-full border-0 min-h-[700px]"
              />
            </div>
          ) : viewMode === 'scroll' ? (
            /* Continuous Scroll Mode for structured pages: renders ALL pages vertically */
            <div
              className="w-full max-w-3xl space-y-8 flex flex-col items-center"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {Array.from({ length: totalPages }).map((_, pIdx) => (
                <div
                  key={pIdx}
                  id={`page-sheet-${pIdx}`}
                  className="w-full bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-slate-200 min-h-[750px] flex flex-col justify-between relative"
                >
                  <div className="absolute top-3 right-4 text-[10px] font-mono text-slate-400">
                    Trang {pIdx + 1} / {totalPages}
                  </div>
                  <div>{renderPageDetails(pIdx)}</div>
                  <div className="border-t border-slate-200 pt-3 mt-6 flex items-center justify-between text-[11px] text-slate-500">
                    <div>Tài liệu Toán THPT • Tác giả Thầy Lê Ngọc Long</div>
                    <div>Trang {pIdx + 1} của {totalPages}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Single Page Flip Reader Mode */
            <div
              className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-slate-200 transition-transform duration-150 min-h-[750px] flex flex-col justify-between"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Paper Page Content */}
              <div>{renderPageDetails(currentPageIndex)}</div>

              {/* Paper Footer */}
              <div className="border-t border-slate-200 pt-4 mt-8 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Bản quyền tài liệu: Thầy Lê Ngọc Long (FPT School)</span>
                </div>
                <div className="font-mono font-bold text-slate-700">
                  Trang {currentPageIndex + 1} / {totalPages}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Page Thumbnail Ribbon (Quick visual jump to ANY page) */}
        <div className="bg-slate-900 border-t border-slate-800 p-2.5 px-4 overflow-x-auto shrink-0 flex items-center gap-1.5 scrollbar-thin">
          <span className="text-[11px] text-slate-400 font-bold shrink-0 mr-2 flex items-center gap-1">
            <ListOrdered className="w-3.5 h-3.5 text-blue-400" />
            Tất cả các trang:
          </span>
          {Array.from({ length: totalPages }).map((_, pIndex) => (
            <button
              key={pIndex}
              onClick={() => setCurrentPageIndex(pIndex)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                currentPageIndex === pIndex
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
              title={`Chuyển thẳng đến trang ${pIndex + 1}`}
            >
              {pIndex + 1}
            </button>
          ))}
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-slate-800/90 border-t border-slate-700 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              Đang xem trang <strong>{currentPageIndex + 1}</strong> trong tổng số <strong>{totalPages} trang</strong> độ phân giải cao.
            </span>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            <button
              onClick={() => onOpenQR(document)}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-600 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span>Mã QR Zalo Tác Giả</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Đóng xem trước
            </button>
            <button
              onClick={() => onDownload(document)}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải Toàn Bộ File PDF ({document.fileSize})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
