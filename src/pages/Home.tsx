import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import { announcementApi } from '../api/announcementApi';
import { Calendar, Play, ArrowRight, Globe, MapPin, Heart, HandHeart, Star } from 'lucide-react';
import { sermonApi } from '../api/sermonApi';
import { eventApi } from '../api/eventApi';
import type { SermonDto, EventDto, AnnouncementDto } from '../types';
import daddy from '../assets/daddy.jpg';
import dadandmum from '../assets/dadandmum.jpg';
import PrayerRequestModal from '../components/PrayerRequestModal';
import TestimonyModal from '../components/TestimonyModal';

const Home: React.FC = () => {
  const [latestSermons, setLatestSermons]             = useState<SermonDto[]>([]);
  const [upcomingEvents, setUpcomingEvents]           = useState<EventDto[]>([]);
  const [latestAnnouncements, setLatestAnnouncements] = useState<AnnouncementDto[]>([]);
  const [showPrayerModal, setShowPrayerModal]         = useState(false);
  const [showTestimonyModal, setShowTestimonyModal]   = useState(false);

  useEffect(() => {
    sermonApi.getAll({ pageSize: 3 }).then(res => {
      if (res.data.isSuccess && res.data.data) setLatestSermons(res.data.data.items);
    });
    eventApi.getUpcoming({ pageSize: 3 }).then(res => {
      if (res.data.isSuccess && res.data.data) setUpcomingEvents(res.data.data.items);
    });
    announcementApi.getAll({ pageSize: 3, module: 'Ministry' }).then(res => {
      if (res.data.isSuccess && res.data.data) setLatestAnnouncements(res.data.data.items);
    });
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  const formatDateLong = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  return (
    <div className="bg-white selection:bg-brand-100">
      <Hero />

      {/* ── Quick Actions Bar ─────────────────────────────────────────── */}
      <div className="relative z-18 -mt-10 max-w-4xl mx-auto px-6">
        <div className="bg-white shadow-2xl rounded-xl grid grid-cols-3 md:grid-cols-6 divide-x divide-slate-100 border border-slate-100 overflow-hidden">

          {[
            { icon: <Play className="w-4 h-4 text-brand-500" />,     label: 'Watch Live', link: '/sermons' },
            { icon: <Calendar className="w-4 h-4 text-brand-500" />, label: 'Events',     link: '/events'  },
            { icon: <MapPin className="w-4 h-4 text-brand-500" />,   label: 'Find Us',    link: '/contact' },
            { icon: <Heart className="w-4 h-4 text-brand-500" />,    label: 'Give',       link: '/give'    },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className="p-5 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 transition-colors group"
            >
              {item.icon}
              <span className="text-xs font-bold uppercase tracking-widest text-slate-700 group-hover:text-brand-600">
                {item.label}
              </span>
            </Link>
          ))}

          {/* Prayer button */}
          <button
            onClick={() => setShowPrayerModal(true)}
            className="p-5 flex flex-col items-center justify-center gap-3 hover:bg-fuchsia-50 transition-colors group"
          >
            <HandHeart className="w-4 h-4 text-fuchsia-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-700 group-hover:text-fuchsia-600">
              Prayer
            </span>
          </button>

          {/* Testimony button */}
          <button
            onClick={() => setShowTestimonyModal(true)}
            className="p-5 flex flex-col items-center justify-center gap-3 hover:bg-amber-50 transition-colors group"
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-700 group-hover:text-amber-600">
              Testimony
            </span>
          </button>

        </div>
      </div>

      {/* ── Sermon Section ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-xl">
              <h2 className="text-xs font-bold text-brand-600 uppercase tracking-[0.3em] mb-4">
                Latest Messages
              </h2>
              <h3 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 leading-tight">
                Spiritual insights for a modern world.
              </h3>
            </div>
            <Link
              to="/sermons"
              className="mt-5 md:mt-0 flex items-center text-slate-900 font-medium border-b-2 border-brand-200 hover:border-brand-600 transition-all pb-1 uppercase text-sm tracking-widest"
            >
              Explore Archive <ArrowRight className="w-3 h-3 ml-2" />
            </Link>
          </div>

          {latestSermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {latestSermons.map((sermon) => (
                <Link key={sermon.id} to={`/sermons/${sermon.id}`} className="group block">
                  <div className="relative aspect-4/5 overflow-hidden rounded-sm mb-6">
                    {sermon.imageUrl ? (
                      <img
                        src={sermon.imageUrl}
                        alt={sermon.title}
                        className="w-full h-full object-cover grayscale-30 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <Play className="w-12 h-12 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-widest rounded-full">
                        {formatDate(sermon.sermonDate)}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-xl font-serif font-medium text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {sermon.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 uppercase tracking-wide italic">
                    {sermon.series}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
              <Play className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 font-serif italic">Messages coming soon. Check back later.</p>
            </div>
          )}

          {/* Announcements */}
          {latestAnnouncements.length > 0 && (
            <section className="py-20 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                  <div>
                    <h2 className="text-xs font-bold text-fuchsia-600 uppercase tracking-[0.3em] mb-4">
                      Latest Updates
                    </h2>
                    <h3 className="text-4xl font-serif font-medium text-slate-900">Announcements</h3>
                  </div>
                  <Link
                    to="/announcements"
                    className="mt-5 md:mt-0 flex items-center text-slate-900 font-medium border-b-2 border-fuchsia-200 hover:border-fuchsia-600 transition-all pb-1 uppercase text-sm tracking-widest"
                  >
                    View All <ArrowRight className="w-3 h-3 ml-2" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {latestAnnouncements.map(announcement => (
                    <Link
                      key={announcement.id}
                      to="/announcements"
                      className="group bg-white rounded-xl p-6 border border-slate-100 hover:border-fuchsia-200 hover:shadow-md transition-all duration-300"
                    >
                      <span className="text-xs font-bold text-fuchsia-600 uppercase tracking-widest block mb-3">
                        {announcement.category || 'General'}
                      </span>
                      <h4 className="text-xl font-serif font-medium text-slate-900 mb-3 group-hover:text-fuchsia-700 transition-colors line-clamp-2">
                        {announcement.title}
                      </h4>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-4">{announcement.content}</p>
                      <span className="text-xs text-slate-400">
                        {new Date(announcement.createdOn).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </section>

      {/* ── Divine Presence Section ───────────────────────────────────── */}
      <section className="relative h-[70vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img src={dadandmum} className="w-full h-full object-cover opacity-40 scale-110 blur-sm" alt="Atmosphere" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <h2 className="text-white text-4xl md:text-6xl font-serif mb-6 leading-tight">
              Experience the <br />
              <span className="italic text-brand-300">Divine Presence</span>
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-md">
              Join us every Tuesday for an atmosphere of worship that transcends the ordinary.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/sermons"
                className="px-8 py-4 bg-white text-slate-900 font-bold uppercase tracking-widest text-sm hover:bg-brand-600 hover:text-gray-600 transition-all shadow-xl">
                Watch Our Story
              </Link>
              <button
                onClick={() => setShowPrayerModal(true)}
                className="px-8 py-4 bg-fuchsia-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-fuchsia-500 transition-all shadow-xl flex items-center gap-2"
              >
                <HandHeart className="w-4 h-4" /> Send a Prayer Request
              </button>
              <button
                onClick={() => setShowTestimonyModal(true)}
                className="px-8 py-4 bg-amber-500 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-400 transition-all shadow-xl flex items-center gap-2"
              >
                <Star className="w-4 h-4" /> Share a Testimony
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────────────────────────────── */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 relative">
              <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl aspect-3/4">
                <img src={dadandmum} alt="Leadership" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white p-4 shadow-xl hidden md:block z-20 rounded-lg">
                <img src={daddy} alt="Apostle" className="w-full h-full object-cover rounded-md" />
              </div>
            </div>
            <div className="lg:col-span-7 lg:pl-12">
              <span className="text-brand-600 font-bold tracking-[0.4em] uppercase text-xs mb-6 block">
                Our Mission & Vision
              </span>
              <h2 className="text-4xl md:text-6xl font-serif font-medium text-slate-900 mb-8">
                Where Faith Meets <span className="italic">Excellence.</span>
              </h2>
              <div className="space-y-8">
                <blockquote className="border-l-4 border-brand-500 pl-8 py-2 italic text-2xl text-slate-700 font-serif">
                  "Faith activates God - Fear activates the Enemy."
                </blockquote>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Inspired by a commitment to spiritual growth and community, Global Flame Ministries
                  provides a sanctuary for those seeking purpose and igniting the passion of Christ
                  in the hearts of men and women worldwide. Like a world-class hotel, we believe in
                  radical hospitality.
                </p>
                <div className="pt-4">
                  <Link
                    to="/about"
                    className="px-10 py-4 border-2 border-slate-900 text-slate-900 font-bold uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all"
                  >
                    Discover More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Event Section ─────────────────────────────────────────────── */}
      <section className="py-22 bg-[#0a0c10] text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-15">
            <h2 className="text-sm font-bold tracking-[0.5em] uppercase text-brand-500 mb-4">Itinerary</h2>
            <h3 className="text-4xl md:text-5xl font-serif">Join Our Global Community</h3>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-slate-800 border border-slate-800">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-[#0a0c10] p-12 hover:bg-slate-900 transition-all group">
                  <p className="text-brand-500 text-xs font-bold uppercase tracking-widest mb-8">{event.module}</p>
                  <h3 className="text-2xl font-serif mb-6 group-hover:translate-x-2 transition-transform">{event.title}</h3>
                  <div className="text-slate-400 text-sm space-y-2 mb-8 uppercase tracking-tighter">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDateLong(event.startDate)}</div>
                    <div className="flex items-center gap-2"><Globe className="w-4 h-4" />{event.location}</div>
                  </div>
                  <Link to="/events" className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-white group-hover:text-brand-400">
                    Reservations <ArrowRight className="ml-2 w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-slate-800 rounded-xl">
              <Calendar className="w-10 h-10 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-serif italic">No upcoming events. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      <PrayerRequestModal isOpen={showPrayerModal} onClose={() => setShowPrayerModal(false)} />
      <TestimonyModal isOpen={showTestimonyModal} onClose={() => setShowTestimonyModal(false)} />
    </div>
  );
};

export default Home;