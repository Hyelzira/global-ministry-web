import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import {
  Users, Megaphone, Calendar, HandHeart,
  Star, MessageSquare, BookOpen, RefreshCw, TrendingUp, Sun, Moon
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import type { DashboardStatsDto } from '../types';

const chartDataSets = {
  Hour: [
    { name: '10:00', visits: 120 }, { name: '11:00', visits: 400 },
    { name: '12:00', visits: 300 }, { name: '13:00', visits: 900 }
  ],
  Day: [
    { name: 'Mon', visits: 2400 }, { name: 'Tue', visits: 1398 },
    { name: 'Wed', visits: 9800 }, { name: 'Thu', visits: 3908 },
    { name: 'Fri', visits: 4800 }, { name: 'Sat', visits: 3800 },
    { name: 'Sun', visits: 4300 }
  ],
  Month: [
    { name: 'Jan', visits: 4000 }, { name: 'Feb', visits: 3000 },
    { name: 'Mar', visits: 7000 }, { name: 'Apr', visits: 2780 }
  ],
  Year: [
    { name: '2023', visits: 50000 }, { name: '2024', visits: 85000 },
    { name: '2025', visits: 120000 }, { name: '2026', visits: 190000 }
  ]
};

const Admin = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<'Hour' | 'Day' | 'Month' | 'Year'>('Day');
  const [stats, setStats]           = useState<DashboardStatsDto | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [isDark, setIsDark]         = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getDashboardStats();
      if (res.data.isSuccess && res.data.data) {
        setStats(res.data.data);
      }
    } catch {
      console.error('Failed to load dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const t = {
    bg:         isDark ? 'bg-[#0d0d0d]'      : 'bg-slate-50',
    headerBg:   isDark ? 'bg-[#0d0d0d]'      : 'bg-white',
    border:     isDark ? 'border-white/5'     : 'border-slate-200',
    card:       isDark ? 'bg-zinc-900 border-zinc-800'  : 'bg-white border-slate-200 shadow-sm',
    cardHover:  isDark ? 'hover:border-fuchsia-500/40 hover:bg-zinc-800' : 'hover:border-fuchsia-400 hover:shadow-md',
    text:       isDark ? 'text-white'         : 'text-slate-900',
    subtext:    isDark ? 'text-zinc-400'      : 'text-slate-600',
    mutedtext:  isDark ? 'text-zinc-600'      : 'text-slate-500',
    selectBg:   isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900',
    btnBg:      isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200',
    chartGrid:  isDark ? '#374151'            : '#e5e7eb',
    chartAxis:  isDark ? '#9ca3af'            : '#6b7280',
    chartTip:   isDark ? { backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }
                       : { backgroundColor: 'white',   borderColor: '#e5e7eb',  color: '#111827' },
    skeletonBg: isDark ? 'bg-white/10'        : 'bg-slate-200',
    skeletonSub:isDark ? 'bg-white/5'         : 'bg-slate-100',
    viewLabel:  isDark ? 'text-zinc-600'      : 'text-slate-400',
    rowLabel:   isDark ? 'text-zinc-500'      : 'text-slate-600',
  };

  const StatCard = ({
    label, value, sub, icon, color, onClick,
  }: {
    label: string;
    value: number;
    sub?: string;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`${t.card} border rounded-2xl p-5 transition-all duration-200 ${
        onClick ? `cursor-pointer ${t.cardHover} hover:scale-[1.02]` : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {onClick && (
          <span className={`text-[10px] uppercase tracking-widest font-bold ${t.viewLabel}`}>
            View →
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="animate-pulse">
          <div className={`h-7 ${t.skeletonBg} rounded w-16 mb-2`} />
          <div className={`h-3 ${t.skeletonSub} rounded w-24`} />
        </div>
      ) : (
        <>
          <p className={`text-2xl font-black mb-1 ${t.text}`}>
            {value.toLocaleString()}
          </p>
          <p className={`text-xs font-black uppercase tracking-widest ${t.text}`}>{label}</p>
          {sub && <p className={`text-xs font-semibold mt-1 ${t.subtext}`}>{sub}</p>}
        </>
      )}
    </div>
  );

  const BreakdownCard = ({
    title, icon, color, rows, onClick,
  }: {
    title: string;
    icon: React.ReactNode;
    color: string;
    rows: { label: string; value: number; accent?: string }[];
    onClick?: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`${t.card} border rounded-2xl p-5 transition-all duration-200 ${
        onClick ? `cursor-pointer ${t.cardHover} hover:scale-[1.02]` : ''
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
            {icon}
          </div>
          <h3 className={`font-black text-sm uppercase tracking-widest ${t.text}`}>
            {title}
          </h3>
        </div>
        {onClick && (
          <span className={`text-[10px] uppercase tracking-widest font-bold ${t.viewLabel}`}>
            View →
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {rows.map((_, i) => (
            <div key={i} className="animate-pulse flex justify-between">
              <div className={`h-3 ${t.skeletonBg} rounded w-24`} />
              <div className={`h-3 ${t.skeletonBg} rounded w-8`} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${t.rowLabel}`}>{row.label}</span>
              <span className={`text-sm font-black ${row.accent ?? t.text}`}>
                {row.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen ${t.bg} ${t.text}`}>

      {/* Header */}
      <div className={`px-8 pt-8 pb-6 border-b ${t.border} ${t.headerBg} flex items-center justify-between`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-fuchsia-500 mb-1">
            Overview
          </p>
          <h2 className={`text-2xl font-black uppercase ${t.text}`}>Analytics Dashboard</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchStats} className={`p-2 rounded-lg transition-colors ${t.btnBg}`} title="Refresh stats">
            <RefreshCw className={`w-4 h-4 ${t.subtext}`} />
          </button>
          <select
            value={timeFilter}
            onChange={e => setTimeFilter(e.target.value as typeof timeFilter)}
            className={`px-4 py-2 rounded-lg border text-sm focus:outline-none focus:border-fuchsia-500/50 ${t.selectBg}`}
          >
            <option value="Hour">Hourly</option>
            <option value="Day">Daily</option>
            <option value="Month">Monthly</option>
            <option value="Year">Yearly</option>
          </select>
          <button
            onClick={() => setIsDark(d => !d)}
            className={`p-2 rounded-lg transition-colors ${t.btnBg}`}
            title="Toggle theme"
          >
            {isDark
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-slate-500" />
            }
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">

        {/* Top stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Users"
            value={stats?.totalUsers ?? 0}
            sub={`${stats?.totalAdmins ?? 0} admins · ${stats?.totalMembers ?? 0} members`}
            icon={<Users size={18} className="text-white" />}
            color="bg-fuchsia-600/80"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            label="Announcements"
            value={stats?.totalAnnouncements ?? 0}
            sub={`${stats?.publishedAnnouncements ?? 0} published · ${stats?.draftAnnouncements ?? 0} drafts`}
            icon={<Megaphone size={18} className="text-white" />}
            color="bg-blue-600/80"
            onClick={() => navigate('/admin/announcements')}
          />
          <StatCard
            label="Total Events"
            value={stats?.totalEvents ?? 0}
            sub={`${stats?.upcomingEvents ?? 0} upcoming · ${stats?.cancelledEvents ?? 0} cancelled`}
            icon={<Calendar size={18} className="text-white" />}
            color="bg-emerald-600/80"
            onClick={() => navigate('/admin/events')}
          />
          <StatCard
            label="Sermons"
            value={stats?.totalSermons ?? 0}
            sub={`${stats?.publishedSermons ?? 0} published · ${stats?.draftSermons ?? 0} drafts`}
            icon={<BookOpen size={18} className="text-white" />}
            color="bg-amber-600/80"
          />
        </div>

        {/* Second row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Prayer Requests"
            value={stats?.totalPrayerRequests ?? 0}
            sub={`${stats?.pendingPrayerRequests ?? 0} pending`}
            icon={<HandHeart size={18} className="text-white" />}
            color="bg-fuchsia-600/80"
            onClick={() => navigate('/admin/prayer-requests')}
          />
          <StatCard
            label="Testimonies"
            value={stats?.totalTestimonies ?? 0}
            sub={`${stats?.pendingTestimonies ?? 0} awaiting review`}
            icon={<Star size={18} className="text-white" />}
            color="bg-amber-600/80"
            onClick={() => navigate('/admin/testimonies')}
          />
          <StatCard
            label="Contact Messages"
            value={stats?.totalContacts ?? 0}
            sub={`${stats?.newContacts ?? 0} new · ${stats?.respondedContacts ?? 0} responded`}
            icon={<MessageSquare size={18} className="text-white" />}
            color="bg-blue-600/80"
            onClick={() => navigate('/admin/contacts')}
          />
          <StatCard
            label="Event Registrations"
            value={stats?.totalEventRegistrations ?? 0}
            icon={<TrendingUp size={18} className="text-white" />}
            color="bg-emerald-600/80"
          />
        </div>

        {/* Chart */}
        <div className={`p-6 rounded-3xl border ${t.card}`}>
          <div className="mb-6">
            <h3 className={`text-xl font-bold ${t.text}`}>Visits Overview</h3>
            <p className={`text-sm ${t.subtext}`}>Showing {timeFilter.toLowerCase()} data</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataSets[timeFilter]}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.chartGrid} />
                <XAxis dataKey="name" stroke={t.chartAxis} />
                <YAxis stroke={t.chartAxis} />
                <Tooltip contentStyle={t.chartTip} />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#d946ef"
                  fill="#d946ef"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BreakdownCard
            title="Contacts"
            icon={<MessageSquare size={16} className="text-white" />}
            color="bg-blue-600/80"
            onClick={() => navigate('/admin/contacts')}
            rows={[
              { label: 'New',       value: stats?.newContacts ?? 0,       accent: 'text-fuchsia-500' },
              { label: 'Read',      value: stats?.readContacts ?? 0,      accent: 'text-blue-500' },
              { label: 'Responded', value: stats?.respondedContacts ?? 0, accent: 'text-emerald-500' },
              { label: 'Closed',    value: stats?.closedContacts ?? 0,    accent: 'text-slate-400' },
            ]}
          />
          <BreakdownCard
            title="Testimonies"
            icon={<Star size={16} className="text-white" />}
            color="bg-amber-600/80"
            onClick={() => navigate('/admin/testimonies')}
            rows={[
              { label: 'Pending',  value: stats?.pendingTestimonies ?? 0,  accent: 'text-amber-500' },
              { label: 'Approved', value: stats?.approvedTestimonies ?? 0, accent: 'text-emerald-500' },
              { label: 'Rejected', value: stats?.rejectedTestimonies ?? 0, accent: 'text-red-500' },
            ]}
          />
          <BreakdownCard
            title="Prayer Requests"
            icon={<HandHeart size={16} className="text-white" />}
            color="bg-fuchsia-600/80"
            onClick={() => navigate('/admin/prayer-requests')}
            rows={[
              { label: 'Pending',  value: stats?.pendingPrayerRequests ?? 0,  accent: 'text-amber-500' },
              { label: 'Attended', value: stats?.attendedPrayerRequests ?? 0, accent: 'text-emerald-500' },
            ]}
          />
          <BreakdownCard
            title="Announcements by Module"
            icon={<Megaphone size={16} className="text-white" />}
            color="bg-blue-600/80"
            onClick={() => navigate('/admin/announcements')}
            rows={[
              { label: 'Ministry', value: stats?.ministryAnnouncements ?? 0, accent: 'text-fuchsia-500' },
              { label: 'Youth',    value: stats?.youthAnnouncements ?? 0,    accent: 'text-amber-500' },
            ]}
          />
          <BreakdownCard
            title="Events by Module"
            icon={<Calendar size={16} className="text-white" />}
            color="bg-emerald-600/80"
            onClick={() => navigate('/admin/events')}
            rows={[
              { label: 'Ministry', value: stats?.ministryEvents ?? 0, accent: 'text-fuchsia-500' },
              { label: 'Youth',    value: stats?.youthEvents ?? 0,    accent: 'text-amber-500' },
            ]}
          />
          <BreakdownCard
            title="Users by Role"
            icon={<Users size={16} className="text-white" />}
            color="bg-fuchsia-600/80"
            onClick={() => navigate('/admin/users')}
            rows={[
              { label: 'Admins',        value: stats?.totalAdmins ?? 0,      accent: 'text-fuchsia-500' },
              { label: 'Members',       value: stats?.totalMembers ?? 0,      accent: 'text-blue-500' },
              { label: 'Youth Members', value: stats?.totalYouthMembers ?? 0, accent: 'text-amber-500' },
            ]}
          />
        </div>

      </div>
    </div>
  );
};

export default Admin;