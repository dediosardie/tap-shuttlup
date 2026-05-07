"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "../../components/dashboard/dashboard-shell";
import { AnalyticsChart } from "../../components/dashboard/analytics-chart";
import { BarChart3, CreditCard, Eye, TrendingUp, Wifi } from "lucide-react";
import { readCards, readAnalytics, type AnalyticsEvent, type DashboardCard } from "@/lib/dashboard-crud";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function sourceLabel(source: AnalyticsEvent["source"]): string {
  if (source === "nfc") return "NFC Tap";
  if (source === "qr") return "QR Scan";
  return "Profile View";
}

export default function DashboardPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [cards, setCards] = useState<DashboardCard[]>([]);

  useEffect(() => {
    void readAnalytics().then(setEvents);
    void readCards().then(setCards);
  }, []);

  const stats = useMemo(() => {
    const taps = events.filter((e) => e.source === "nfc").length;
    const views = events.length;
    const qr = events.filter((e) => e.source === "qr").length;
    const activeCards = cards.filter((c) => c.status === "active").length;
    return [
      { label: "Total Taps", value: taps.toLocaleString(), icon: Wifi, color: "text-[var(--accent-color)]" },
      { label: "Profile Views", value: views.toLocaleString(), icon: Eye, color: "text-blue-400" },
      { label: "QR Scans", value: qr.toLocaleString(), icon: TrendingUp, color: "text-emerald-400" },
      { label: "Active Cards", value: activeCards.toLocaleString(), icon: CreditCard, color: "text-violet-400" },
    ];
  }, [events, cards]);

  const recentActivity = useMemo(
    () => [...events].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10),
    [events],
  );

  return (
    <DashboardShell title="Overview">
      {/* Stats grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="floating-card rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="mt-3 text-3xl font-bold text-[var(--text-primary)]">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-6">
        <AnalyticsChart events={events} />
      </div>

      {/* Recent activity */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[var(--accent-color)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Recent Activity</h2>
        </div>
        <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] overflow-hidden">
          {recentActivity.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">No activity yet.</p>
          ) : (
            recentActivity.map((event, i) => (
              <div
                key={event.id}
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  i < recentActivity.length - 1 ? "border-b border-[var(--border-muted)]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                    <Wifi className="h-3.5 w-3.5 text-[var(--accent-color)]" />
                  </span>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{sourceLabel(event.source)}</p>
                    <p className="text-xs text-[var(--text-muted)]">{event.city || "Unknown"} · {event.device || "Unknown"}</p>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-disabled)]">{timeAgo(event.created_at)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}