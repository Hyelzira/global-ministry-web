import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Home,
  Users,
  MessageSquare,
  HeartHandshake,
  Sparkles,
  TrendingUp,
} from "lucide-react";

/* =====================================================
   ADMIN DASHBOARD
===================================================== */

export default function AdminDashboard() {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */

  const [stats] = useState({
    users: 1240,
    messages: 328,
    prayers: 112,
    testimonies: 76,
  });

  const [chartData, setChartData] = useState<{ day: string; activity: number }[]>([]);

  /* ---------------- FETCH DATA (MOCK) ---------------- */

  useEffect(() => {
    // Replace later with API/Firebase call
    setChartData([
      { day: "Mon", activity: 20 },
      { day: "Tue", activity: 35 },
      { day: "Wed", activity: 28 },
      { day: "Thu", activity: 50 },
      { day: "Fri", activity: 44 },
      { day: "Sat", activity: 60 },
      { day: "Sun", activity: 75 },
    ]);
  }, []);

  /* ---------------- COMPONENTS ---------------- */

  const StatCard = ({ icon: Icon, title, value, growth }: { icon: React.ComponentType<{ className: string; size: number }>; title: string; value: number; growth: string }) => (
    <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{value}</h2>

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

  const SideStat = ({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className: string }>; label: string; value: number; color: string }) => (
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
      <div className="flex items-center gap-3">
        <Icon className={color} />
        <span className="font-medium">{label}</span>
      </div>

      <span className="text-xl font-bold">{value}</span>
    </div>
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">
            Monitor platform activity & engagement
          </p>
        </div>

        {/* BACK TO HOME */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
        >
          <Home size={18} />
          Back to Home
        </button>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.users}
          growth="+12% this month"
        />

        <StatCard
          icon={MessageSquare}
          title="Messages"
          value={stats.messages}
          growth="+8% engagement"
        />

        <StatCard
          icon={HeartHandshake}
          title="Prayer Requests"
          value={stats.prayers}
          growth="+5% increase"
        />

        <StatCard
          icon={Sparkles}
          title="Testimonies"
          value={stats.testimonies}
          growth="+18% growth"
        />
      </div>

      {/* ================= GRAPH + SIDE PANEL ================= */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* GRAPH */}
        <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            Weekly Activity Overview
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="activity"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SIDE STATISTICS */}
        <div className="bg-white border rounded-2xl shadow-sm p-6 flex flex-col gap-6">
          <h2 className="text-lg font-semibold">
            Live Statistics
          </h2>

          <SideStat
            icon={MessageSquare}
            label="Messages"
            value={stats.messages}
            color="text-indigo-600"
          />

          <SideStat
            icon={HeartHandshake}
            label="Prayer Requests"
            value={stats.prayers}
            color="text-pink-600"
          />

          <SideStat
            icon={Sparkles}
            label="Testimonies"
            value={stats.testimonies}
            color="text-yellow-500"
          />

          {/* Insight Card */}
          <div className="bg-indigo-50 rounded-xl p-4 mt-auto">
            <p className="text-indigo-700 font-semibold text-sm">
              Platform Insight
            </p>

            <p className="text-gray-600 text-sm mt-2">
              Community engagement is growing steadily. Prayer
              requests and testimonies indicate increasing
              participation this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}