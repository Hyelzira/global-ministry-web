import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import {
  Home, Users, MessageSquare, HeartHandshake, Sparkles,
  TrendingUp, Heart, Library
} from "lucide-react";
import { adminApi } from "../../api/adminApi";
import type { DashboardStatsDto } from "../../types";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ── STATE ──────────────────────────────────────────────────
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [chartData] = useState([
    { day: "Mon", activity: 20 },
    { day: "Tue", activity: 35 },
    { day: "Wed", activity: 28 },
    { day: "Thu", activity: 50 },
    { day: "Fri", activity: 44 },
    { day: "Sat", activity: 60 },
    { day: "Sun", activity: 75 },
  ]);

  // ── FETCH REAL DATA ────────────────────────────────────────
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await adminApi.getDashboardStats();
        if (res.data.isSuccess && res.data.data) {
          setStats(res.data.data);
        } else {
          setError("Failed to load dashboard stats.");
        }
      } catch (err) {
        setError("Could not reach the server. Check your connection.");
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ── COMPONENTS ─────────────────────────────────────────────
  const StatCard = ({
    icon: Icon, title, value, growth,
  }: {
    icon: React.ComponentType<{ className: string; size: number }>;
    title: string;
    value: number | undefined;
    growth: string;
  }) => (
    <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-1" />
          ) : (
            <h2 className="text-2xl font-bold mt-1">{value ?? 0}</h2>
          )}
          <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
            <TrendingUp size={14} />
            {growth}
          </div>
        </div>
        <div className="bg-indigo-50 p-3 rounded-xl">
          <Icon className="text-indigo-600" size={22} />
        </div>
      </div>
    </div>
  );

  const SideStat = ({
    icon: Icon, label, value, color,
  }: {
    icon: React.ComponentType<{ className: string }>;
    label: string;
    value: number | undefined;
    color: string;
  }) => (
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
      <div className="flex items-center gap-3">
        <Icon className={color} />
        <span className="font-medium">{label}</span>
      </div>
      {isLoading ? (
        <div className="h-6 w-10 bg-gray-200 animate-pulse rounded" />
      ) : (
        <span className="text-xl font-bold">{value ?? 0}</span>
      )}
    </div>
  );

  // ── UI ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Monitor platform activity & engagement</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
        >
          <Home size={18} />
          Back to Home
        </button>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* KPI CARDS — original 4 preserved, donations and books added */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats?.totalUsers}
          growth="+12% this month"
        />
        <StatCard
          icon={MessageSquare}
          title="Contacts"
          value={stats?.totalContacts}
          growth="+8% engagement"
        />
        <StatCard
          icon={HeartHandshake}
          title="Prayer Requests"
          value={stats?.totalPrayerRequests}
          growth="+5% increase"
        />
        <StatCard
          icon={Sparkles}
          title="Testimonies"
          value={stats?.totalTestimonies}
          growth="+18% growth"
        />
      </div>

      {/* SECOND ROW — Donations and Books */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        {/* DONATIONS CARD */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm">Donations</p>
              {isLoading ? (
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                <h2 className="text-2xl font-bold mt-1">
                  ₦{(stats?.totalAmountReceived ?? 0).toLocaleString()}
                </h2>
              )}
              <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                <TrendingUp size={14} />
                Total amount received
              </div>
            </div>
            <div className="bg-pink-50 p-3 rounded-xl">
              <Heart className="text-pink-600" size={22} />
            </div>
          </div>
          {!isLoading && stats && (
            <div className="grid grid-cols-2 gap-2 text-center text-xs text-gray-500 mt-2">
              <div className="bg-green-50 rounded-xl p-2">
                <p className="text-lg font-bold text-green-700">{stats.completedDonations}</p>
                <p>Completed</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-2">
                <p className="text-lg font-bold text-amber-600">{stats.pendingDonations}</p>
                <p>Pending</p>
              </div>
            </div>
          )}
        </div>

        {/* BOOKS CARD */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm">Books</p>
              {isLoading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                <h2 className="text-2xl font-bold mt-1">{stats?.totalBooks ?? 0}</h2>
              )}
              <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                <TrendingUp size={14} />
                Total in library
              </div>
            </div>
            <div className="bg-violet-50 p-3 rounded-xl">
              <Library className="text-violet-600" size={22} />
            </div>
          </div>
          {!isLoading && stats && (
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-500 mt-2">
              <div className="bg-gray-50 rounded-xl p-2">
                <p className="text-lg font-bold text-gray-800">{stats.publishedBooks}</p>
                <p>Published</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-2">
                <p className="text-lg font-bold text-gray-800">{stats.draftBooks}</p>
                <p>Drafts</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-2">
                <p className="text-lg font-bold text-gray-800">{stats.featuredBooks}</p>
                <p>Featured</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GRAPH + SIDE PANEL — completely unchanged */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* GRAPH */}
        <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Activity Overview</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="activity" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SIDE STATISTICS — original stats preserved, donations and books added */}
        <div className="bg-white border rounded-2xl shadow-sm p-6 flex flex-col gap-6">
          <h2 className="text-lg font-semibold">Live Statistics</h2>

          <SideStat
            icon={MessageSquare}
            label="Contacts"
            value={stats?.totalContacts}
            color="text-indigo-600"
          />
          <SideStat
            icon={HeartHandshake}
            label="Prayer Requests"
            value={stats?.totalPrayerRequests}
            color="text-pink-600"
          />
          <SideStat
            icon={Sparkles}
            label="Testimonies"
            value={stats?.totalTestimonies}
            color="text-yellow-500"
          />
          <SideStat
            icon={Heart}
            label="Donations"
            value={stats?.completedDonations}
            color="text-rose-500"
          />
          <SideStat
            icon={Library}
            label="Books"
            value={stats?.totalBooks}
            color="text-violet-600"
          />

          {/* Extra mini stats grid — original preserved, books added */}
          {!isLoading && stats && (
            <div className="grid grid-cols-2 gap-2 text-center text-xs text-gray-500 mt-2">
              <div className="bg-gray-50 rounded-xl p-2">
                <p className="text-lg font-bold text-gray-800">{stats.totalEvents}</p>
                <p>Events</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-2">
                <p className="text-lg font-bold text-gray-800">{stats.totalSermons}</p>
                <p>Sermons</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-2">
                <p className="text-lg font-bold text-gray-800">{stats.totalAnnouncements}</p>
                <p>Announcements</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-2">
                <p className="text-lg font-bold text-gray-800">{stats.pendingPrayerRequests}</p>
                <p>Pending Prayers</p>
              </div>
            </div>
          )}

          <div className="bg-indigo-50 rounded-xl p-4 mt-auto">
            <p className="text-indigo-700 font-semibold text-sm">Platform Insight</p>
            <p className="text-gray-600 text-sm mt-2">
              Community engagement is growing steadily. Prayer requests and
              testimonies indicate increasing participation this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}