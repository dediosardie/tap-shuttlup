import { useEffect, useMemo, useState } from "react";
import { Download, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";
import { AnalyticsChart } from "@/app/components/dashboard/AnalyticsChart";
import {
  createAnalyticsEvent,
  deleteAnalyticsEvent,
  readAnalytics,
  updateAnalyticsEvent,
  type AnalyticsEvent,
} from "@/lib/dashboard-crud";

export function DashboardAnalyticsPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ source: "nfc" | "qr" | "direct"; city: string; device: string; referrer: string }>({ source: "nfc", city: "", device: "", referrer: "" });

  useEffect(() => {
    void readAnalytics().then(setEvents);
  }, []);

  const monthStats = useMemo(() => {
    const taps = events.filter((e) => e.source === "nfc").length;
    const views = events.length;
    const uniqueCities = new Set(events.map((e) => e.city).filter(Boolean)).size;
    const conversion = views ? ((events.filter((e) => e.source === "qr").length / views) * 100).toFixed(1) : "0.0";
    return [
      { label: "Total Taps", value: taps.toLocaleString(), sub: "From NFC events" },
      { label: "Profile Views", value: views.toLocaleString(), sub: "All sources" },
      { label: "Cities", value: uniqueCities.toLocaleString(), sub: "Tracked locations" },
      { label: "QR Share", value: `${conversion}%`, sub: "QR / total views" },
    ];
  }, [events]);

  const geoData = useMemo(() => {
    const total = Math.max(events.length, 1);
    const map = new Map<string, number>();
    events.forEach((event) => {
      const key = event.city || "Unknown";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return [...map.entries()]
      .map(([city, taps]) => ({ city, country: "PH", taps, pct: Number(((taps / total) * 100).toFixed(1)) }))
      .sort((a, b) => b.taps - a.taps);
  }, [events]);

  const sourceBreakdown = useMemo(() => {
    const total = events.length;
    const counts = {
      nfc: events.filter((e) => e.source === "nfc").length,
      qr: events.filter((e) => e.source === "qr").length,
      direct: events.filter((e) => e.source === "direct").length,
    };

    const rows: Array<{ key: "nfc" | "qr" | "direct"; label: string; count: number; pct: number; color: string }> = [
      {
        key: "nfc",
        label: "NFC Tap",
        count: counts.nfc,
        pct: total ? Number(((counts.nfc / total) * 100).toFixed(1)) : 0,
        color: "#f97316",
      },
      {
        key: "qr",
        label: "QR",
        count: counts.qr,
        pct: total ? Number(((counts.qr / total) * 100).toFixed(1)) : 0,
        color: "#fb923c",
      },
      {
        key: "direct",
        label: "Direct",
        count: counts.direct,
        pct: total ? Number(((counts.direct / total) * 100).toFixed(1)) : 0,
        color: "#fdba74",
      },
    ];

    const leader = [...rows].sort((a, b) => b.count - a.count)[0];
    return { total, rows, leader };
  }, [events]);

  async function handleCreate() {
    if (!form.city || !form.device) {
      return;
    }
    const created = await createAnalyticsEvent(form);
    setEvents((prev) => [created, ...prev]);
    setForm({ source: "nfc", city: "", device: "", referrer: "" });
  }

  async function handleUpdate(event: AnalyticsEvent, patch: Partial<AnalyticsEvent>) {
    const next = { ...event, ...patch };
    await updateAnalyticsEvent(next);
    setEvents((prev) => prev.map((e) => (e.id === next.id ? next : e)));
  }

  async function handleDelete(id: string) {
    await deleteAnalyticsEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <DashboardShell title="Analytics">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {monthStats.map(({ label, value, sub }) => (
          <div key={label} className="floating-card rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5">
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
            <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
            <p className="mt-0.5 text-xs text-[var(--text-disabled)]">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <AnalyticsChart />
      </div>

      <div className="mb-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Traffic Sources</h2>
          <p className="text-xs text-[var(--text-muted)]">
            {sourceBreakdown.total.toLocaleString()} total visits
          </p>
        </div>

        <div className="space-y-2.5">
          {sourceBreakdown.rows.map((row) => (
            <div key={row.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">{row.label}</span>
                <span className="font-medium text-[var(--text-primary)]">{row.count.toLocaleString()} ({row.pct}%)</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${row.pct}%`, backgroundColor: row.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-[var(--text-disabled)]">
          Top source: <span className="text-[var(--text-secondary)]">{sourceBreakdown.leader.label}</span>
        </p>
      </div>

      <div className="mb-6 grid gap-2 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4 sm:grid-cols-5">
        <select
          value={form.source}
          onChange={(e) => setForm((p) => ({ ...p, source: e.target.value as "nfc" | "qr" | "direct" }))}
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        >
          <option value="nfc">NFC</option>
          <option value="qr">QR</option>
          <option value="direct">Direct</option>
        </select>
        <input
          value={form.city}
          onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
          placeholder="City"
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
        <input
          value={form.device}
          onChange={(e) => setForm((p) => ({ ...p, device: e.target.value }))}
          placeholder="Device"
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
        <input
          value={form.referrer}
          onChange={(e) => setForm((p) => ({ ...p, referrer: e.target.value }))}
          placeholder="Referrer"
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-color)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-[var(--accent-color)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Geographic Breakdown</h2>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)]">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-[var(--border-muted)] px-4 py-2.5 text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
            <span>City</span><span>Taps</span><span>Share</span>
          </div>
          {geoData.map((row) => (
            <div
              key={row.city}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[var(--border-muted)] px-4 py-3 text-sm last:border-0"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--bg-elevated)] text-[10px] font-bold text-[var(--accent-color)]">
                  {row.country}
                </div>
                <span className="text-[var(--text-primary)]">{row.city}</span>
              </div>
              <span className="font-medium text-[var(--text-primary)]">{row.taps.toLocaleString()}</span>
              <div className="flex w-20 items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent-color)]"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-[var(--text-muted)]">{row.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)]">
        <div className="grid grid-cols-[100px_1fr_1fr_1fr_auto] gap-3 border-b border-[var(--border-muted)] px-4 py-2 text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
          <span>Source</span>
          <span>City</span>
          <span>Device</span>
          <span>Referrer</span>
          <span>Actions</span>
        </div>
        {events.map((event) => (
          <div key={event.id} className="grid grid-cols-[100px_1fr_1fr_1fr_auto] items-center gap-3 border-b border-[var(--border-muted)] px-4 py-2 text-sm last:border-0">
            <span className="uppercase text-[var(--text-secondary)]">{event.source}</span>
            <input
              value={event.city}
              disabled={editingId !== event.id}
              onChange={(e) => handleUpdate(event, { city: e.target.value })}
              className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2 py-1 text-sm text-[var(--text-primary)] disabled:opacity-80"
            />
            <input
              value={event.device}
              disabled={editingId !== event.id}
              onChange={(e) => handleUpdate(event, { device: e.target.value })}
              className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2 py-1 text-sm text-[var(--text-primary)] disabled:opacity-80"
            />
            <input
              value={event.referrer}
              disabled={editingId !== event.id}
              onChange={(e) => handleUpdate(event, { referrer: e.target.value })}
              className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2 py-1 text-sm text-[var(--text-primary)] disabled:opacity-80"
            />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setEditingId((v) => (v === event.id ? null : event.id))}
                className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(event.id)}
                className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] p-1.5 text-[var(--text-muted)] hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
