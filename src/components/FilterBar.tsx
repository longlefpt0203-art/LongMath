import React from 'react';
import { Search, SlidersHorizontal, Award, Sparkles, BookOpen, X } from 'lucide-react';
import { CategoryType, MainNavTab } from '../types';
import { MATH_TOPICS } from '../data/initialDocuments';

interface FilterBarProps {
  activeNavTab: MainNavTab;
  examSubTag: 'all' | 'de-thi-hsg' | 'de-thi-tn-thpt';
  onExamSubTagChange: (subTag: 'all' | 'de-thi-hsg' | 'de-thi-tn-thpt') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  sortBy: 'newest' | 'downloads' | 'pages';
  onSortChange: (sort: 'newest' | 'downloads' | 'pages') => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeNavTab,
  examSubTag,
  onExamSubTagChange,
  searchQuery,
  onSearchChange,
  selectedGrade,
  onGradeChange,
  selectedTopic,
  onTopicChange,
  sortBy,
  onSortChange,
  totalResults,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 md:p-5 shadow-xs mb-6 space-y-4">
      {/* Top Row: Sub-tags for "Đề thi" OR Context Intro for "Tài liệu" */}
      {activeNavTab === 'de-thi' ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Phân loại đề thi:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Tất cả */}
              <button
                id="filter-subtag-all"
                onClick={() => onExamSubTagChange('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  examSubTag === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả đề thi
              </button>

              {/* Sub-tag 1: Đề thi HSG */}
              <button
                id="filter-subtag-hsg"
                onClick={() => onExamSubTagChange('de-thi-hsg')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  examSubTag === 'de-thi-hsg'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Đề thi HSG (Học sinh giỏi)</span>
              </button>

              {/* Sub-tag 2: Đề thi TN THPT */}
              <button
                id="filter-subtag-tn-thpt"
                onClick={() => onExamSubTagChange('de-thi-tn-thpt')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  examSubTag === 'de-thi-tn-thpt'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Đề thi TN THPT (Tốt nghiệp)</span>
              </button>
            </div>
          </div>

          <div className="text-xs font-medium text-slate-500">
            Tìm thấy <span className="font-bold text-slate-800">{totalResults}</span> đề thi phù hợp
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">
              Thư mục Tài Liệu: Chuyên đề lý thuyết, bài tập phân dạng & công thức Toán THPT
            </span>
          </div>
          <div>
            Tìm thấy <span className="font-bold text-slate-800">{totalResults}</span> tài liệu
          </div>
        </div>
      )}

      {/* Main Filter Controls: Search & Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Instant Search Box */}
        <div className="lg:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên tài liệu, tóm tắt, mã LaTeX (VD: LTX-1201)..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs md:text-sm text-slate-900 placeholder:text-slate-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Khối lớp Filter */}
        <div className="lg:col-span-2">
          <select
            id="filter-grade-select"
            value={selectedGrade}
            onChange={(e) => onGradeChange(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-blue-500 text-xs md:text-sm text-slate-700 cursor-pointer font-medium"
          >
            <option value="all">Tất cả khối lớp</option>
            <option value="12">Lớp 12</option>
            <option value="11">Lớp 11</option>
            <option value="10">Lớp 10</option>
          </select>
        </div>

        {/* Chuyên đề Toán Filter */}
        <div className="lg:col-span-3">
          <select
            id="filter-topic-select"
            value={selectedTopic}
            onChange={(e) => onTopicChange(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-blue-500 text-xs md:text-sm text-slate-700 cursor-pointer font-medium"
          >
            {MATH_TOPICS.map((topic, idx) => (
              <option key={idx} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Sắp xếp Filter */}
        <div className="lg:col-span-2">
          <select
            id="filter-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-blue-500 text-xs md:text-sm text-slate-700 cursor-pointer font-medium"
          >
            <option value="newest">Mới cập nhật</option>
            <option value="downloads">Lượt tải nhiều nhất</option>
            <option value="pages">Số trang (Dài đến ngắn)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
