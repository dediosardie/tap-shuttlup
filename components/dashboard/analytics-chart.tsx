"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";

const weeklyData = [
  { day: "Mon", taps: 44, views: 32, saves: 8 },
  { day: "Tue", taps: 51, views: 38, saves: 12 },
  { day: "Wed", taps: 67, views: 49, saves: 15 },
  { day: "Thu", taps: 72, views: 57, saves: 19 },
  { day: "Fri", taps: 89, views: 69, saves: 22 },
  { day: "Sat", taps: 73, views: 61, saves: 17 },
  { day: "Sun", taps: 64, views: 53, saves: 14 },
];

const deviceData = [
  { name: "Mobile", value: 68, color: "#f97316" },
  { name: "Desktop", value: 22, color: "#fb923c" },
  { name: "Tablet", value: 10, color: "#fdba74" },
];

const sourceData = [
  { source: "NFC Tap", count: 142 },
  { source: "QR Code", count: 87 },
  { source: "Direct", count: 53 },
  { source: "Shared Link", count: 31 },
];

const tooltipStyle = {
  backgroundColor: "rgba(18,18,18,0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#e5e5e5",
  fontSize: "12px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
};

const axisStyle = { stroke: "rgba(255,255,255,0.25)", fontSize: 11 };

export function AnalyticsChart() {
  return (
    <div className="space-y-6">
      {/* Taps & Views line chart */}
      <div>
        <p className="mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">Weekly Activity</p>
        <div className="h-[260px] w-full rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="gradTaps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb923c" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#fb923c" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(249,115,22,0.2)" }} />
              <Area type="monotone" dataKey="taps" name="Taps" stroke="#f97316" fill="url(#gradTaps)" strokeWidth={2.2} dot={false} />
              <Area type="monotone" dataKey="views" name="Views" stroke="#fb923c" fill="url(#gradViews)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Device breakdown */}
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">Device Breakdown</p>
          <div className="h-[220px] rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {deviceData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: "#8a8a8a" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic source */}
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">Traffic Source</p>
          <div className="h-[220px] rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis dataKey="source" type="category" tick={axisStyle} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(249,115,22,0.06)" }} />
                <Bar dataKey="count" name="Visits" fill="#f97316" radius={[0, 6, 6, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

