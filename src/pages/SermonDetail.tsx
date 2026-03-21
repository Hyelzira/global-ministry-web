import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Tag, Share2, Download, FileText,
  ArrowLeft, Play, Clock, ChevronRight, Music
} from 'lucide-react';
import { sermonApi } from '../api/sermonApi';
import type { SermonDto } from '../types';
import dad from '../assets/dad.jpg';
import mummy from '../assets/mummy.jpg';

const SermonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sermon, setSermon] = useState<SermonDto | null>(null);
  const [related, setRelated] = useState<SermonDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSermon = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await sermonApi.getById(Number(id));
        if (response.data.isSuccess && response.data.data) {
          setSermon(response.data.data);

          const allResponse = await sermonApi.getAll({ pageSize: 10 });
          if (allResponse.data.isSuccess && allResponse.data.data) {
            const others = allResponse.data.data.items
              .filter(s => s.id !== Number(id))
              .slice(0, 3);
            setRelated(others);
          }
        }
      } catch (error) {
        console.error('Failed to fetch sermon:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSermon();
  }, [id]);

  const getSpeakerImage = (speakerName: string) => {
    const name = speakerName.toLowerCase();
    if (name.includes('danjuma') || name.includes('gasuk')) return dad;
    if (name.includes('faith')) return mummy;
    return dad;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBFE] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-serif italic">Loading message...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!sermon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 pt-20">
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">
            Sermon Not Found
          </h2>
          <p className="text-slate-500 mb-8">
            The message you are looking for might have been moved or archived.
          </p>
          <button
            onClick={() => navigate('/sermons')}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-fuchsia-600 transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Archive
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-[#FBFBFE] min-h-screen">

      {/* Cinematic Theater Header */}
      <div className="bg-[#0F172A] pt-12 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-slate-400 text-sm font-medium">
            <Link to="/sermons" className="hover:text-white transition-colors">
              Archive
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-500 truncate">{sermon.title}</span>
          </nav>

          {/* Video Player */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            {sermon.videoUrl ? (
              <iframe
                src={sermon.videoUrl}
                title={sermon.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                {sermon.imageUrl && (
                  <img
                    src={sermon.imageUrl}
                    alt={sermon.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm scale-105"
                  />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                  <p className="text-white font-serif text-xl">
                    Video recording in progress...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Column */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">

              {/* Meta Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="flex items-center px-4 py-1.5 bg-fuchsia-50 text-fuchsia-700 rounded-full text-xs font-bold border border-fuchsia-100">
                  <Tag className="w-3.5 h-3.5 mr-2" /> {sermon.series}
                </span>
                <span className="flex items-center px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100">
                  <Calendar className="w-3.5 h-3.5 mr-2" /> {formatDate(sermon.sermonDate)}
                </span>
                <span className="flex items-center px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100">
                  <Clock className="w-3.5 h-3.5 mr-2" /> Full Message
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                {sermon.title}
              </h1>

              {/* Speaker Card */}
              <div className="flex items-center p-6 bg-slate-50 rounded-2xl mb-10 border border-slate-100">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-sm mr-4 shrink-0">
                  <img
                    src={getSpeakerImage(sermon.speaker)}
                    alt={sermon.speaker}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-fuchsia-600 font-black mb-1">
                    Delivered By
                  </p>
                  <h4 className="text-xl font-bold text-slate-900">{sermon.speaker}</h4>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                <p className="text-xl leading-relaxed font-medium text-slate-700 mb-8 border-l-4 border-fuchsia-500 pl-6 italic">
                  {sermon.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">

            {/* Resources */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Download className="w-5 h-5 mr-3 text-fuchsia-400" /> Resources
              </h3>
              <div className="space-y-4">

                {/* Sermon Notes — placeholder */}
                <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all">
                  <div className="flex items-center">
                    <div className="p-2 bg-fuchsia-500/20 rounded-lg mr-3">
                      <FileText className="w-4 h-4 text-fuchsia-400" />
                    </div>
                    <span className="font-semibold text-sm">Sermon Notes</span>
                  </div>
                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded font-bold uppercase">
                    PDF
                  </span>
                </button>

                {/* ✅ Audio — real if available, disabled if not */}
                {sermon.audioUrl ? (
                  <div className="space-y-2">
                    <a
                      href={sermon.audioUrl}
                      download
                      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                          <Play className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="font-semibold text-sm">Download Audio</span>
                      </div>
                      <span className="text-[10px] bg-white/10 px-2 py-1 rounded font-bold uppercase">
                        MP3
                      </span>
                    </a>
                    {/* Inline audio player */}
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
                        Stream Audio
                      </p>
                      <audio controls className="w-full">
                        <source src={sermon.audioUrl} />
                      </audio>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 opacity-40 cursor-not-allowed">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                        <Play className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="font-semibold text-sm">Audio Unavailable</span>
                    </div>
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded font-bold uppercase">
                      MP3
                    </span>
                  </div>
                )}

                <hr className="border-white/5 my-2" />

                <button className="w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" /> Share This Message
                </button>
              </div>
            </div>

            {/* Related Sermons */}
            {related.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
                  Recommended
                  <Link
                    to="/sermons"
                    className="text-xs text-fuchsia-600 hover:underline"
                  >
                    View All
                  </Link>
                </h3>
                <div className="space-y-6">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/sermons/${rel.id}`}
                      className="group flex gap-4 items-center"
                    >
                      <div className="w-20 h-20 shrink-0 relative rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                        {rel.imageUrl ? (
                          <img
                            src={rel.imageUrl}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-8 h-8 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-slate-900 leading-tight group-hover:text-fuchsia-600 transition-colors line-clamp-2 mb-1">
                          {rel.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          {rel.speaker}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SermonDetail;