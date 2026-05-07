import { useMemo } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import type { AnalyticsEvent } from "@/lib/dashboard-crud";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const tooltipStyle = {
  backgroundColor: "rgba(18,18,18,0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#e5e5e5",
  fontSize: "12px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
};

const axisStyle = { stroke: "rgba(255,255,255,0.25)", fontSize: 11 };

function buildWeeklyData(events: AnalyticsEvent[]) {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayEvents = events.filter((e) => e.created_at.slice(0, 10) === dateStr);
    return {
      day: DAYS[d.getDay()],
      taps: dayEvents.filter((e) => e.source === "nfc").length,
      views: dayEvents.length,
    };
  });
}

function buildDeviceData(events: AnalyticsEvent[]) {
  const mobile = events.filter((e) => /mobile|android|iphone/i.test(e.device ?? "")).length;
  const tablet = events.filter((e) => /tablet|ipad/i.test(e.device ?? "")).length;
  const desktop = events.length - mobile - tablet;
  return [
    { name: "Mobile", value: mobile, color: "#f97316" },
    { name: "Desktop", value: desktop, color: "#fb923c" },
    { name: "Tablet", value: tablet, color: "#fdba74" },
  ].filter((d) => d.value > 0);
}

function buildSourceData(events: AnalyticsEvent[]) {
  return [
    { source: "NFC Tap", count: events.filter((e) => e.source === "nfc").length },
    { source: "QR Code", count: events.filter((e) => e.source === "qr").length },
    { source: "Direct", count: events.filter((e) => e.source === "direct").length },
  ];
}

export function AnalyticsChart({ events = [] }: { events?: AnalyticsEvent[] }) {
  const weeklyData = useMemo(() => buildWeeklyData(events), [events]);
  const deviceData = useMemo(() => buildDeviceData(events), [events]);
  const sourceData = useMemo(() => buildSourceData(events), [events]);
  return (
    <div className="space-y-6">
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
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#8a8a8a" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

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
