import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

import {
  Users, Megaphone, Calendar, MessageSquare,
  BookOpen, RefreshCw, TrendingUp, Sun, Moon,
  ArrowUpRight, Home, ArrowLeft
} from 'lucide-react';

import { adminApi } from '../../api/adminApi';
import type { DashboardStatsDto } from '../../types';

/* ---------------- TYPES ---------------- */
interface StatCardProps {
  label: string;
  value: number;
  sub?: string;
  icon: React.ReactNode;
  gradient: string;
  onClick?: () => void;
}

/* ---------------- CHART DATA ---------------- */
const chartDataSets = {
  Hour: [{ name: '10:00', visits: 120 }, { name: '11:00', visits: 400 }, { name: '12:00', visits: 300 }, { name: '13:00', visits: 900 }],
  Day: [{ name: 'Mon', visits: 2400 }, { name: 'Tue', visits: 1398 }, { name: 'Wed', visits: 9800 }, { name: 'Thu', visits: 3908 }, { name: 'Fri', visits: 4800 }, { name: 'Sat', visits: 3800 }, { name: 'Sun', visits: 4300 }],
  Month: [{ name: 'Jan', visits: 4000 }, { name: 'Feb', visits: 3000 }, { name: 'Mar', visits: 7000 }, { name: 'Apr', visits: 2780 }],
  Year: [{ name: '2023', visits: 50000 }, { name: '2024', visits: 85000 }, { name: '2025', visits: 120000 }, { name: '2026', visits: 190000 }]
};

const Admin = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<'Hour' | 'Day' | 'Month' | 'Year'>('Day');
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const goHome = () => navigate('/');

  const fetchStats = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  /* ---------------- THEME ---------------- */
  const t = {
    bg: isDark ? 'bg-[#050505]' : 'bg-[#f8fafc]',
    headerBg: isDark ? 'bg-[#050505]/60 backdrop-blur-2xl' : 'bg-white/70 backdrop-blur-2xl',
    border: isDark ? 'border-white/10' : 'border-slate-200/80',
    card: isDark ? 'bg-white/[0.03] border-white/10 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl border border-slate-200 shadow-lg shadow-slate-200/40',
    cardHover: 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-fuchsia-500/10 transition-all duration-300',
    text: isDark ? 'text-white' : 'text-slate-900',
    subtext: isDark ? 'text-slate-400' : 'text-slate-500',
    chartGrid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    btn: isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
  };

  /* ---------------- COMPONENTS ---------------- */
  const StatCard = ({ label, value, sub, icon, gradient, onClick }: StatCardProps) => (
    <div
      onClick={onClick}
      className={`${t.card} ${t.cardHover} relative overflow-hidden rounded-3xl p-6 border group cursor-pointer`}
    >
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${gradient} shadow-lg shadow-black/10`}>
          {icon}
        </div>
        <p className={`text-sm font-medium ${t.subtext}`}>{label}</p>
        <div className="flex items-center gap-2 mt-1">
          <h3 className={`text-3xl font-bold ${t.text}`}>
            {isLoading ? <span className="animate-pulse">...</span> : value.toLocaleString()}
          </h3>
          <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1 text-fuchsia-500" />
        </div>
        {sub && <p className={`text-xs mt-2 ${t.subtext} font-medium`}>{sub}</p>}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans ${t.bg} ${t.text} transition-colors duration-300`}>
      <header className={`sticky top-0 z-50 border-b ${t.border} ${t.headerBg} px-6 md:px-10 py-4`}>
        <div className="max-w-[1600px] mx-auto flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-600/20">
              <TrendingUp size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              GFM <span className="text-fuchsia-500 font-black">CORE</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goHome}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${t.border} ${t.btn} text-sm font-bold transition-all`}
            >
              <ArrowLeft size={14} />
              <Home size={14} />
              <span className="hidden sm:inline">Home</span>
            </button>

            <div className={`flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border ${t.border}`}>
              {(['Hour', 'Day', 'Month', 'Year'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-black rounded-lg transition-all ${
                    timeFilter === f ? 'bg-fuchsia-600 text-white shadow-md' : t.subtext + ' hover:text-fuchsia-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-2">
              <button onClick={fetchStats} className={`p-2.5 rounded-xl border ${t.border} ${t.btn}`}>
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border ${t.border} ${t.btn}`}>
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Community"
            value={stats?.totalUsers ?? 0}
            sub={`${stats?.totalAdmins ?? 0} Admins • ${stats?.totalMembers ?? 0} Members`}
            icon={<Users className="text-white" size={22} />}
            gradient="bg-gradient-to-br from-fuchsia-600 to-purple-700"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            label="Engagement"
            value={stats?.totalAnnouncements ?? 0}
            sub="Published announcements"
            icon={<Megaphone className="text-white" size={22} />}
            gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
            onClick={() => navigate('/admin/announcements')}
          />
          <StatCard
            label="Event Flow"
            value={stats?.totalEvents ?? 0}
            sub={`${stats?.upcomingEvents ?? 0} active events scheduled`}
            icon={<Calendar className="text-white" size={22} />}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            onClick={() => navigate('/admin/events')}
          />
          <StatCard
            label="Spiritual Growth"
            value={stats?.totalSermons ?? 0}
            sub="Sermons & teachings online"
            icon={<BookOpen className="text-white" size={22} />}
            gradient="bg-gradient-to-br from-orange-500 to-amber-600"
            onClick={() => navigate('/admin/sermons')}
          />
        </div>

        <div className={`${t.card} border rounded-[32px] p-8 shadow-2xl shadow-fuchsia-500/[0.03]`}>
          <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-xl font-bold">Traffic Overview</h3>
               <p className={`text-sm ${t.subtext}`}>Visualizing platform visits over {timeFilter.toLowerCase()}</p>
             </div>
             <TrendingUp className="text-fuchsia-500 opacity-50" size={24} />
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataSets[timeFilter]}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.chartGrid}/>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12, fontWeight: 600}} 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#111' : '#fff',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    color: isDark ? '#fff' : '#000'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#d946ef"
                  strokeWidth={4}
                  fill="url(#colorVisits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;