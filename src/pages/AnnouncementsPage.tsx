import React, { useState, useEffect } from 'react';
import { Bell, Search, Calendar, Tag, ArrowRight, X } from 'lucide-react';
import { announcementApi } from '../api/announcementApi';
import type { AnnouncementDto } from '../types';

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementDto | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 9;

  const categories = [
    ...new Set(announcements.map(a => a.category).filter(Boolean))
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      try {
        const response = await announcementApi.getAll({
          pageNumber,
          pageSize,
          title: searchQuery || undefined,
          category: selectedCategory || undefined,
          module: 'Ministry',
        });

        if (response.data.isSuccess && response.data.data) {
          setAnnouncements(response.data.data.items);
          setTotalCount(response.data.data.totalCount);
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeout = setTimeout(fetchAnnouncements, 300);
    return () => clearTimeout(timeout);
  }, [pageNumber, searchQuery, selectedCategory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-[#0a0a0a] py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-64 h-64 border border-white rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-fuchsia-500" />
            <h2 className="text-fuchsia-500 uppercase tracking-[0.3em] text-sm font-bold">
              Stay Updated
            </h2>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-tight">
            Announcements
          </h1>
          <div className="w-20 h-1 bg-fuchsia-500 mx-auto mb-10" />

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setPageNumber(1);
                }}
                className="w-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-white/40 pl-12 pr-4 py-3 rounded-lg outline-none focus:border-fuchsia-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 overflow-x-auto">
            <button
              onClick={() => { setSelectedCategory(''); setPageNumber(1); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === ''
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-fuchsia-400'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setPageNumber(1); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-fuchsia-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-2 bg-slate-200 rounded mb-4 w-1/4" />
                <div className="h-6 bg-slate-200 rounded mb-3" />
                <div className="h-4 bg-slate-200 rounded mb-2 w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && announcements.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-2xl">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-slate-400 mb-2">
              No Announcements
            </h3>
            <p className="text-slate-400">
              {searchQuery
                ? 'No announcements match your search.'
                : 'Check back soon for updates.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-fuchsia-600 text-sm font-bold uppercase tracking-widest"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Announcements Grid */}
        {!isLoading && announcements.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {announcements.map(announcement => (
                <div
                  key={announcement.id}
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className="group cursor-pointer border border-slate-100 rounded-xl p-6 hover:border-fuchsia-200 hover:shadow-lg transition-all duration-300"
                >
                  {/* Category + Date */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-1 text-xs font-bold text-fuchsia-600 uppercase tracking-widest">
                      <Tag className="w-3 h-3" />
                      {announcement.category || 'General'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(announcement.createdOn)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-serif font-medium text-slate-900 mb-3 group-hover:text-fuchsia-700 transition-colors line-clamp-2">
                    {announcement.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">
                    {announcement.content}
                  </p>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-fuchsia-600 text-sm font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                <button
                  onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                  disabled={pageNumber === 1}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:border-fuchsia-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages ||
                    Math.abs(p - pageNumber) <= 1)
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="text-slate-400">...</span>
                      )}
                      <button
                        onClick={() => setPageNumber(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                          pageNumber === p
                            ? 'bg-fuchsia-600 text-white'
                            : 'border border-slate-200 text-slate-600 hover:border-fuchsia-400'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))
                }

                <button
                  onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
                  disabled={pageNumber === totalPages}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:border-fuchsia-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── ANNOUNCEMENT DETAIL MODAL ─────────────────────────────────── */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedAnnouncement(null)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center gap-1 text-xs font-bold text-fuchsia-600 uppercase tracking-widest">
                  <Tag className="w-3 h-3" />
                  {selectedAnnouncement.category || 'General'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {formatDate(selectedAnnouncement.createdOn)}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">
                {selectedAnnouncement.title}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-1">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="w-full py-3 bg-slate-900 text-white font-bold uppercase tracking-widest hover:bg-fuchsia-600 transition-colors rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;